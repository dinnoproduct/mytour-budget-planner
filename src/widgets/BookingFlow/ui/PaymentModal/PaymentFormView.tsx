import { Box, Flex, RadioGroup, Radio } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { AlertCardMessage, Button, Checkbox, Input, Text } from '@ui'
import {
  type PaymentFormViewProps,
  type PaymentOption
} from '@widgets/BookingFlow/ui/PaymentModal/types.ts'
import { overDaysFromNow } from '@/utils/methods.ts'
import { useMemo, useState } from 'react'
import moment from 'moment'

const NO_DOWNPAYMENT_ACCEPTABLE_DAYS_COUNT = 40

export const PaymentFormView = ({
  onSubmit,
  packageDetails,
  isLoadingBooking,
  isBooked,
  initialPaymentOption = 'pay',
  prepaymentInfo
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

  const paymentOptions = useMemo(() => {
    if (prepaymentInfo) {
      return {
        isPartialPaymentAllowed:
          prepaymentInfo.paymentType === 'PartialPricePayment' ||
          prepaymentInfo.paymentType === 'NoDownPayment',
        isNoDownPaymentAllowed: prepaymentInfo.paymentType === 'NoDownPayment',
        isFullPaymentOnly: prepaymentInfo.paymentType === 'FullPricePayment'
      }
    }

    // Fallback to old logic
    return {
      isPartialPaymentAllowed: !under21DaysFromNow,
      isNoDownPaymentAllowed: overDaysFromNow(departureDate, 40) && !isBooked,
      isFullPaymentOnly: under21DaysFromNow
    }
  }, [prepaymentInfo, under21DaysFromNow, departureDate, isBooked])

  const minPrePaymentAmount = useMemo(() => {
    if (paymentOptions.isFullPaymentOnly) {
      return packageDetails.price
    }

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
    packageDetails.price
  ])

  const [isPaymentInFull, setIsPaymentInFull] = useState(
    paymentOptions.isFullPaymentOnly
  )
  const [paymentAmount, setPaymentAmount] = useState(minPrePaymentAmount)
  const [errorElements, setErrorElements] = useState<React.ReactNode | null>(
    null
  )
  const [isDisabled, setIsDisabled] = useState(false)
  const [selectedOption, setSelectedOption] =
    useState<PaymentOption>(initialPaymentOption)

  const handleAmountChange = (value: string | number) => {
    const number = Number(value)

    if (isNaN(number)) {
      return
    }

    if (number < minPrePaymentAmount) {
      if (
        prepaymentInfo?.minimumAcceptablePaymentPercentage &&
        minPrePaymentAmount > 0
      ) {
        const percentage = prepaymentInfo.minimumAcceptablePaymentPercentage
        setErrorElements(
          <>
            {t('minPrePaymentPercentage', { percentage })}
            <br />
            {t('minPrePaymentAmount', { amount: minPrePaymentAmount })}
          </>
        )
      } else {
        setErrorElements(
          <>
            {t`minPrePayment`} {minPrePaymentAmount}
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

  const handleFormSubmit = (e: React.FormEvent<HTMLDivElement>) => {
    if (errorElements) {
      return
    }

    e.preventDefault()
    onSubmit(+paymentAmount, selectedOption)
  }

  // 40 days no prepayment for package
  const noPrepaymentData = useMemo(() => {
    const isEnabled = paymentOptions.isNoDownPaymentAllowed
    let paymentDueDate = ''
    let days: number | null = null

    if (isEnabled) {
      if (prepaymentInfo?.firstPaymentDate) {
        paymentDueDate = moment(prepaymentInfo.firstPaymentDate).format(
          'DD/MM/YYYY'
        )
      } else {
        paymentDueDate = moment(departureDate)
          .subtract(NO_DOWNPAYMENT_ACCEPTABLE_DAYS_COUNT, 'days')
          .format('DD/MM/YYYY')
      }

      days =
        prepaymentInfo?.minimumAcceptableDaysCount ??
        NO_DOWNPAYMENT_ACCEPTABLE_DAYS_COUNT
    }

    return {
      isEnabled,
      paymentDueDate,
      paymentAmount: minPrePaymentAmount,
      days
    }
  }, [
    paymentOptions.isNoDownPaymentAllowed,
    prepaymentInfo,
    departureDate,
    minPrePaymentAmount
  ])

  return (
    <Flex
      direction="column"
      justify="space-between"
      as="form"
      onSubmit={handleFormSubmit}
      width="full"
      height="full"
    >
      <Flex
        width="full"
        py="6"
        px="4"
        overflowY="scroll"
        height={{ base: 'calc(100dvh - 160px)', md: 'calc(464px - 160px)' }}
        direction="column"
        maxWidth="402px"
        mx="auto"
        sx={{
          '&::-webkit-scrollbar': {
            width: '0'
          }
        }}
      >
        {paymentOptions.isNoDownPaymentAllowed ? (
          <RadioGroup
            onChange={(value: PaymentOption) => setSelectedOption(value)}
            value={selectedOption}
          >
            <Radio value="pay">{t`pay`}</Radio>
            <Radio value="noPrepayment" ml="4">{t`noPrepayment`}</Radio>
          </RadioGroup>
        ) : (
          <Text size="sm" fontWeight="semibold" align="center">
            {t('minPrePaymentText', {
              amount: minPrePaymentAmount
            })}
          </Text>
        )}

        <Box mt="6">
          {selectedOption === 'pay' && (
            <>
              <Input
                value={paymentAmount}
                onChange={e => handleAmountChange(e.target.value)}
                isDisabled={isPaymentInFull || paymentOptions.isFullPaymentOnly}
                suffix
                state={errorElements ? 'invalid' : 'default'}
                rightIconName="dram"
              />

              {errorElements && (
                <Text size="xs" color="red.500" mt="1">
                  {errorElements}
                </Text>
              )}

              <Checkbox
                size="lg"
                mt="4"
                isDisabled={paymentOptions.isFullPaymentOnly}
                onChange={handlePayInFullChange}
                isChecked={isPaymentInFull}
              >
                {t`payInFull`}
              </Checkbox>
            </>
          )}

          {selectedOption === 'noPrepayment' && (
            <AlertCardMessage
              message={t('noPrepaymentTextWithDetails', {
                amount: noPrepaymentData.paymentAmount,
                dueDate: noPrepaymentData.paymentDueDate,
                days: noPrepaymentData.days
              })}
              status="info"
              textSize="md"
              iconPlacement="start"
            />
          )}

          <Text size="xs" color="gray.600" mt="6" letterSpacing="-0.31px">
            {t`partialPaymentText`}
          </Text>
        </Box>
      </Flex>

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
          isDisabled={isDisabled}
          isLoading={isLoadingBooking}
        >
          {t`continue`}
        </Button>
      </Box>
    </Flex>
  )
}
