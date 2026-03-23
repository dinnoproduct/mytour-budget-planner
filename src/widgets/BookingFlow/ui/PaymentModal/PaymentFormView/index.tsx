import { Box, Flex, VStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useRef, useState, useEffect, useMemo } from 'react'
import { Button, Input } from '@ui'
import { formatNumber } from '@shared/utils'
import moment from 'moment'
import { StepBottomActions } from '@widgets/BookingFlow/ui/StepBottomActions'
import { PaymentOptionsWithRadio } from './PaymentOptionsWithRadio'
import { SimplePaymentContent } from './SimplePaymentContent'
import { PaymentOptionCard } from './PaymentOptionCard'
import type { PaymentFormViewProps, PaymentOption } from '../types'

const DAYS_COUNT_FOR_PARTIAL_PAYMENT = 40

export const PaymentFormView = ({
  onSubmit,
  packageDetails,
  isLoadingBooking = false,
  initialPaymentOption = 'pay',
  prepaymentInfo,   
  onBackClick,
  renderAsPage = false,
  onPaymentOptionChange,
  disableNoPrepayment = false,
}: PaymentFormViewProps & { onPaymentOptionChange?: (option: PaymentOption) => void }) => {
  const { t } = useTranslation()
  const [selectedOption, setSelectedOption] =
    useState<PaymentOption>(initialPaymentOption)
  const [paymentAmount, setPaymentAmount] = useState<number>(() => {
    const min = prepaymentInfo?.minimumAcceptablePayment ?? 0
    return min > 0 ? min : Math.floor(packageDetails.price / 2)
  })
  const [amountError, setAmountError] = useState<string | null>(null)

  const selectedOptionRef = useRef(selectedOption)
  const paymentAmountRef = useRef(paymentAmount)
  selectedOptionRef.current = selectedOption
  paymentAmountRef.current = paymentAmount

  const isFullPaymentOnly =
    prepaymentInfo?.paymentType === 'FullPricePayment'
  const isNoPrepaymentDisabled =
    disableNoPrepayment || prepaymentInfo?.paymentType === 'PartialPricePayment'
  const minPrePaymentAmount =
    prepaymentInfo?.minimumAcceptablePayment ?? Math.floor(packageDetails.price / 2)

  // When prepayment info arrives/changes, ensure the partial option shows the correct minimum
  useEffect(() => {
    if (selectedOption === 'pay') {
      setPaymentAmount(minPrePaymentAmount)
    }
  }, [minPrePaymentAmount])

  useEffect(() => {
    if (isFullPaymentOnly) {
      setSelectedOption('payFull')
    } else {
      setSelectedOption(initialPaymentOption)
    }
  }, [initialPaymentOption, isFullPaymentOnly])

  const noPrepaymentData = useMemo(
    () => ({
      paymentAmount: minPrePaymentAmount || packageDetails.price,
      paymentDueDate: prepaymentInfo?.firstPaymentDate
        ? moment(prepaymentInfo.firstPaymentDate).format('DD.MM.YYYY')
        : '',
      days: prepaymentInfo?.minimumAcceptableDaysCount ?? DAYS_COUNT_FOR_PARTIAL_PAYMENT,
    }),
    [
      packageDetails.price,
      prepaymentInfo?.firstPaymentDate,
      prepaymentInfo?.minimumAcceptableDaysCount,
    ],
  )

  const handleOptionChange = (option: PaymentOption) => {
    setAmountError(null)
    onPaymentOptionChange?.(option)
    if (option === 'payFull') {
      setSelectedOption(option)
      setPaymentAmount(packageDetails.price)
    } else if (option === 'noPrepayment') {
      setSelectedOption(option)
      setPaymentAmount(0)
    } else if (option === 'pay') {
      setSelectedOption(option)
      // Only set to min when switching TO pay from another option, not when already selected (e.g. focus on input)
      if (selectedOption !== 'pay') {
        setPaymentAmount(minPrePaymentAmount)
      }
    }
  }

  const handleAmountChange = (value: string | number) => {
    const num = typeof value === 'string' ? parseInt(value, 10) || 0 : value
    // Cap to full price when user writes more than needed
    const capped = Math.min(num, packageDetails.price)
    setPaymentAmount(capped)
    setAmountError(null)
  }

  const handleAmountBlur = () => setAmountError(null)

  const getSubmitAmount = (): number => {
    const opt = selectedOptionRef.current
    if (opt === 'payFull') return packageDetails.price
    if (opt === 'noPrepayment') return 0
    return paymentAmountRef.current
  }

  const isAmountBelowMin =
    selectedOption === 'pay' && paymentAmount < minPrePaymentAmount
  const isAmountInvalid = isAmountBelowMin
  const showAmountError = isAmountInvalid || amountError
  const errorElements = showAmountError ? (
    <span>
      {amountError ??
        t('minPrePaymentAmount', { amount: formatNumber(minPrePaymentAmount) })}
    </span>
  ) : null
  const isDisabled = selectedOption === 'pay' && isAmountInvalid
  const isSubmitDisabled = isFullPaymentOnly
    ? false
    : selectedOption === 'pay'
      ? isDisabled
      : false

  const handleFormSubmit = () => {
    const opt = selectedOptionRef.current
    const amount = getSubmitAmount()
    if (opt === 'pay' && amount < minPrePaymentAmount) {
      setAmountError(
        t('minPrePaymentAmount', {
          amount: formatNumber(minPrePaymentAmount),
        }),
      )
      return
    }
    onSubmit(amount, opt)
  }

  return (
    <Flex
      direction="column"
      justify="space-between"
      width="full"
      {...(renderAsPage ? {} : { height: 'full' })}
    >
      <Flex
        width="full"
        py={renderAsPage ? 0 : '6'}
        px={renderAsPage ? 0 : '4'}
        overflowY={
          renderAsPage
            ? { base: 'visible', md: 'visible' }
            : { base: 'scroll', md: 'visible' }
        }
        {...(renderAsPage
          ? {}
          : { maxHeight: { base: 'calc(100dvh - 160px)', md: 'none' } })}
        direction="column"
        maxWidth={renderAsPage ? 'full' : '402px'}
        mx="auto"
        sx={{
          '&::-webkit-scrollbar': {
            width: '0',
          },
        }}
        marginBottom={renderAsPage && !isFullPaymentOnly ? {base: '140px', md: 'auto'} : 'auto'}
      >

        {isFullPaymentOnly ? (
          
            <SimplePaymentContent
              isFullPaymentOnly={true}
              paymentAmount={packageDetails.price}
              onAmountChange={() => {}}
              isPaymentInFull={true}
              onPayInFullChange={() => {}}
              errorElements={null}
              packageDetails={packageDetails}
              days={prepaymentInfo?.minimumAcceptableDaysCount ?? DAYS_COUNT_FOR_PARTIAL_PAYMENT}
              minPrePaymentAmount={minPrePaymentAmount}
              t={t}
            />
           
        ) : (
          <PaymentOptionsWithRadio
            selectedOption={selectedOption}
            onOptionChange={handleOptionChange}
            paymentAmount={paymentAmount}
            onAmountChange={handleAmountChange}
            onAmountBlur={handleAmountBlur}
            errorElements={errorElements}
            packageDetails={packageDetails}
            prepaymentInfo={prepaymentInfo}
            minPrePaymentAmount={minPrePaymentAmount}
            noPrepaymentData={noPrepaymentData}
            t={t}
            disableNoPrepayment={isNoPrepaymentDisabled}
          />
        )}
      </Flex>

      {renderAsPage && onBackClick ? (
        <StepBottomActions
          stickyOnMobile
          onBack={onBackClick}
          backLabel={t`back`}
          isLoadingBooking={isLoadingBooking}
          isDisabled={isSubmitDisabled}
          primaryButton={
            <Button
              variant="solid-blue"
              size="lg"
              width="full"
              onClick={handleFormSubmit}
              isDisabled={isSubmitDisabled}
              isLoading={isLoadingBooking}
            >
              {t`continue`}
            </Button>
          }
        />
      ) : (
        <Box
          p="4"
          width="full"
          borderTop="1px solid"
          borderColor="gray.100"
          backgroundColor="white"
          mt="auto"
        >
          <Button
            variant="solid-blue"
            size="lg"
            width="full"
            onClick={handleFormSubmit}
            isDisabled={isSubmitDisabled}
            isLoading={isLoadingBooking}
          >
            {t`continue`}
          </Button>
        </Box>
      )}
    </Flex>
  )
}
