import { Box, Flex } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Button } from '@ui'
import { StepBottomActions } from '@widgets/BookingFlow/ui/StepBottomActions'
import {
  type PaymentFormViewProps,
  type PaymentOption,
} from '@widgets/BookingFlow/ui/PaymentModal/types'
import { overDaysFromNow } from '@/utils/methods'
import { useMemo, useState, useEffect } from 'react'
import moment from 'moment'
import { PaymentOptionsWithRadio } from './PaymentOptionsWithRadio'
import { SimplePaymentContent } from './SimplePaymentContent'

const NO_DOWNPAYMENT_ACCEPTABLE_DAYS_COUNT = 40

export const PaymentFormView = ({
  onSubmit,
  packageDetails,
  isLoadingBooking,
  isBooked,
  initialPaymentOption = 'pay',
  prepaymentInfo,
  onBackClick,
  renderAsPage = false,
}: PaymentFormViewProps) => {
  const { t } = useTranslation()

  const departureDate = useMemo(
    () =>
      packageDetails?.destinationFlight?.departureDate ||
      packageDetails?.checkin,
    [packageDetails?.destinationFlight?.departureDate, packageDetails?.checkin]
  )
  const under21DaysFromNow = useMemo(
    () => !overDaysFromNow(departureDate, 21) && !isBooked,
    [departureDate, isBooked]
  )
  const over40DaysFromNow = useMemo(
    () => overDaysFromNow(departureDate, 40) && !isBooked,
    [departureDate, isBooked]
  )

  const paymentOptions = useMemo(() => {
    if (prepaymentInfo) {
      return {
        isPartialPaymentAllowed:
          prepaymentInfo.paymentType === 'PartialPricePayment' ||
          prepaymentInfo.paymentType === 'NoDownPayment',
        isNoDownPaymentAllowed: prepaymentInfo.paymentType === 'NoDownPayment',
        isFullPaymentOnly: prepaymentInfo.paymentType === 'FullPricePayment',
      }
    }
    return {
      isPartialPaymentAllowed: !under21DaysFromNow,
      isNoDownPaymentAllowed: over40DaysFromNow,
      isFullPaymentOnly: under21DaysFromNow,
    }
  }, [prepaymentInfo, under21DaysFromNow, over40DaysFromNow, isBooked])

  const minPrePaymentAmount = useMemo(() => {
    if (paymentOptions.isFullPaymentOnly) return packageDetails.price
    if (prepaymentInfo && paymentOptions.isPartialPaymentAllowed) {
      return prepaymentInfo.minimumAcceptablePayment
    }
    if (paymentOptions.isPartialPaymentAllowed) {
      return Math.ceil(packageDetails.price / 2)
    }
    return packageDetails.price
  }, [
    prepaymentInfo,
    paymentOptions.isPartialPaymentAllowed,
    paymentOptions.isFullPaymentOnly,
    packageDetails.price,
  ])

  const [selectedOption, setSelectedOption] = useState<PaymentOption>(() => {
    if (paymentOptions.isNoDownPaymentAllowed)
      return initialPaymentOption === 'noPrepayment' ? 'noPrepayment' : initialPaymentOption === 'payFull' ? 'payFull' : 'pay'
    return paymentOptions.isFullPaymentOnly ? 'payFull' : 'pay'
  })
  const [paymentAmount, setPaymentAmount] = useState(minPrePaymentAmount)
  const [isPaymentInFull, setIsPaymentInFull] = useState(paymentOptions.isFullPaymentOnly)
  const [errorElements, setErrorElements] = useState<React.ReactNode | null>(null)
  const [isDisabled, setIsDisabled] = useState(false)

  useEffect(() => {
    if (!paymentOptions.isNoDownPaymentAllowed) {
      setSelectedOption(paymentOptions.isFullPaymentOnly ? 'payFull' : 'pay')
      setPaymentAmount(paymentOptions.isFullPaymentOnly ? packageDetails.price : minPrePaymentAmount)
    }
  }, [
    paymentOptions.isNoDownPaymentAllowed,
    paymentOptions.isFullPaymentOnly,
    packageDetails.price,
    minPrePaymentAmount,
  ])

  const isSubmitDisabled = selectedOption === 'pay' ? isDisabled : false

  const handleAmountChange = (value: string | number) => {
    const number = Number(value)
    if (isNaN(number)) return

    if (number < minPrePaymentAmount) {
      if (
        prepaymentInfo?.minimumAcceptablePaymentPercentage &&
        minPrePaymentAmount > 0
      ) {
        setErrorElements(
          <>
            {t('minPrePaymentPercentage', {
              percentage: prepaymentInfo.minimumAcceptablePaymentPercentage,
            })}
            <br />
            {t('minPrePaymentAmount', { amount: minPrePaymentAmount })}
          </>
        )
      } else {
        setErrorElements(
          <>
            {t('minPrePayment')} {minPrePaymentAmount}
          </>
        )
      }
      setPaymentAmount(number)
      setIsDisabled(true)
    } else if (number >= packageDetails.price) {
      setErrorElements(null)
      setPaymentAmount(packageDetails.price)
      setIsDisabled(false)
    } else {
      setErrorElements(null)
      setPaymentAmount(number)
      setIsDisabled(false)
    }
  }

  const handlePayInFullChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!paymentOptions.isFullPaymentOnly) {
      setIsPaymentInFull(e.target.checked)
      setErrorElements(null)
      const amount = e.target.checked
        ? packageDetails.price
        : minPrePaymentAmount
      setPaymentAmount(amount)
      handleAmountChange(amount)
    }
  }

  const getSubmitAmount = () => {
    if (selectedOption === 'payFull') return packageDetails.price
    if (selectedOption === 'noPrepayment') return 0
    return +paymentAmount
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLDivElement>) => {
    if (errorElements) return
    e.preventDefault()
    onSubmit(getSubmitAmount(), selectedOption)
  }

  const noPrepaymentData = useMemo(() => {
    const isEnabled = paymentOptions.isNoDownPaymentAllowed
    let paymentDueDate = ''
    let days: number | null = null

    if (isEnabled) {
      paymentDueDate = prepaymentInfo?.firstPaymentDate
        ? moment(prepaymentInfo.firstPaymentDate).format('DD/MM/YYYY')
        : moment(departureDate)
            .subtract(NO_DOWNPAYMENT_ACCEPTABLE_DAYS_COUNT, 'days')
            .format('DD/MM/YYYY')
      days =
        prepaymentInfo?.minimumAcceptableDaysCount ??
        NO_DOWNPAYMENT_ACCEPTABLE_DAYS_COUNT
    }

    return {
      isEnabled,
      paymentDueDate,
      paymentAmount: minPrePaymentAmount,
      days,
    }
  }, [
    paymentOptions.isNoDownPaymentAllowed,
    prepaymentInfo,
    departureDate,
    minPrePaymentAmount,
  ])

  return (
    <Flex
      direction="column"
      justify="space-between"
      as="form"
      onSubmit={handleFormSubmit}
      width="full"
      {...(renderAsPage ? {} : { height: 'full' })}
      px={0}
      py={0}
    >
      <Flex
        width="full"
        overflowY={renderAsPage ? { base: 'visible', md: 'visible' } : { base: 'scroll', md: 'visible' }}
        {...(renderAsPage ? {} : { height: { base: 'calc(100dvh - 160px)', md: 'auto' } })}
        direction="column"
        mx="auto"
        sx={{ '&::-webkit-scrollbar': { width: '0' } }}
      >
        {paymentOptions.isNoDownPaymentAllowed ? (
          <PaymentOptionsWithRadio
            selectedOption={selectedOption}
            onOptionChange={setSelectedOption}
            paymentAmount={paymentAmount}
            onAmountChange={handleAmountChange}
            errorElements={errorElements}
            packageDetails={packageDetails}
            prepaymentInfo={prepaymentInfo}
            minPrePaymentAmount={minPrePaymentAmount}
            noPrepaymentData={noPrepaymentData}
            t={t}
          />
        ) : (
          <SimplePaymentContent
            isFullPaymentOnly={paymentOptions.isFullPaymentOnly}
            paymentAmount={paymentAmount}
            onAmountChange={handleAmountChange}
            isPaymentInFull={isPaymentInFull}
            onPayInFullChange={handlePayInFullChange}
            errorElements={errorElements}
            packageDetails={packageDetails}
            minPrePaymentAmount={minPrePaymentAmount}
            t={t}
          />
        )}
      </Flex>

      {renderAsPage && onBackClick ? (
        <StepBottomActions
          isDisabled={isSubmitDisabled}
          isLoadingBooking={isLoadingBooking}
          stickyOnMobile
          onBack={onBackClick}
          backLabel={t('back')}
          primaryButton={
            <Button
              variant="solid-blue"
              type="submit"
              size="lg"
              width="full"
              isDisabled={isSubmitDisabled}
              isLoading={isLoadingBooking}
            >
              {t('continue')}
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
            type="submit"
            size="lg"
            width="full"
            isDisabled={isSubmitDisabled}
            isLoading={isLoadingBooking}
          >
            {t('continue')}
          </Button>
        </Box>
      )}
    </Flex>
  )
}
