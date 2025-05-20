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

export const PaymentFormView = ({
  onSubmit,
  packageDetails,
  isLoadingBooking,
  isBooked,
  initialPaymentOption = 'pay'
}: PaymentFormViewProps) => {
  const { t } = useTranslation()

  const under21DaysFromNow = useMemo(() => {
    const departureDate =
      packageDetails?.destinationFlight?.departureDate ||
      packageDetails?.checkin

    return !overDaysFromNow(departureDate, 21) && !isBooked
  }, [
    packageDetails?.destinationFlight?.departureDate,
    isBooked,
    packageDetails?.checkin
  ])

  const [isPaymentInFull, setIsPaymentInFull] = useState(under21DaysFromNow)
  const minPrePaymentAmount = useMemo(
    () =>
      under21DaysFromNow
        ? packageDetails.price
        : Math.ceil(packageDetails.price / 2),
    [under21DaysFromNow, packageDetails.price]
  )
  const [paymentAmount, setPaymentAmount] = useState(minPrePaymentAmount)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isDisabled, setIsDisabled] = useState(false)
  const [selectedOption, setSelectedOption] =
    useState<PaymentOption>(initialPaymentOption)

  const handleAmountChange = (value: string | number) => {
    const number = Number(value)

    if (isNaN(number)) {
      return
    }

    if (number < minPrePaymentAmount) {
      setErrorMessage(`${t`minPrePayment`} ${minPrePaymentAmount}`)
      setPaymentAmount(number)
      setIsDisabled(true)
    } else if (number >= packageDetails.price) {
      setErrorMessage(null)
      setPaymentAmount(packageDetails.price)
      setIsDisabled(false)
    } else {
      setErrorMessage(null)
      setPaymentAmount(number)
      setIsDisabled(false)
    }
  }

  const handlePayInFullChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!under21DaysFromNow) {
      setIsPaymentInFull(e.target.checked)
      setErrorMessage(null)
      const amount = e.target.checked
        ? packageDetails.price
        : minPrePaymentAmount
      setPaymentAmount(amount)
      handleAmountChange(amount)
    }
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLDivElement>) => {
    if (errorMessage) {
      return
    }

    e.preventDefault()
    onSubmit(+paymentAmount, selectedOption)
  }

  // 40 days no prepayment for package
  const noPrepaymentData = useMemo(() => {
    const departureDate =
      packageDetails?.destinationFlight?.departureDate ||
      packageDetails?.checkin

    return {
      isEnabled: overDaysFromNow(departureDate, 40) && !isBooked,
      paymentDueDate: moment(departureDate)
        .subtract(35, 'days')
        .format('DD/MM/YYYY'),
      paymentAmount: minPrePaymentAmount
    }
  }, [
    isBooked,
    minPrePaymentAmount,
    packageDetails?.destinationFlight?.departureDate,
    packageDetails?.checkin
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
        {noPrepaymentData.isEnabled ? (
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
                isDisabled={isPaymentInFull || under21DaysFromNow}
                suffix
                helperText={errorMessage || ''}
                state={errorMessage ? 'invalid' : 'default'}
                rightIconName="dram"
              />

              <Checkbox
                size="lg"
                mt="4"
                isDisabled={under21DaysFromNow}
                onChange={handlePayInFullChange}
                isChecked={isPaymentInFull}
              >
                {t`payInFull`}
              </Checkbox>
            </>
          )}

          {selectedOption === 'noPrepayment' && (
            <AlertCardMessage
              message={t('noPrepaymentText', {
                amount: noPrepaymentData.paymentAmount,
                dueDate: noPrepaymentData.paymentDueDate
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
