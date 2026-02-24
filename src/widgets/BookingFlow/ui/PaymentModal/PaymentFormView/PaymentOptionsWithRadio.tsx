import { RadioGroup, VStack } from '@chakra-ui/react'
import { AlertCardMessage, AlertCardMultipleMessage, Input, Text } from '@ui'
import { formatNumber } from '@shared/utils'
import { useEffect } from 'react'
import type { PaymentOption } from '../types'
import { PaymentOptionCard } from './PaymentOptionCard'

type PaymentOptionsWithRadioProps = {
  selectedOption: PaymentOption
  onOptionChange: (value: PaymentOption) => void
  paymentAmount: number
  onAmountChange: (value: string | number) => void
  onAmountFocus?: () => void
  onAmountBlur?: () => void
  errorElements: React.ReactNode | null
  packageDetails: { price: number }
  prepaymentInfo?: { minimumAcceptablePaymentPercentage?: number } | null
  minPrePaymentAmount: number
  noPrepaymentData: {
    paymentAmount: number
    paymentDueDate: string
    days: number | null
  }
  t: (key: string, params?: Record<string, unknown>) => string
  /** When true, hides the "no prepayment" option. */
  disableNoPrepayment?: boolean
}

export const PaymentOptionsWithRadio = ({
  selectedOption,
  onOptionChange,
  paymentAmount,
  onAmountChange,
  onAmountFocus,
  onAmountBlur,
  errorElements,
  packageDetails,
  prepaymentInfo,
  minPrePaymentAmount,
  noPrepaymentData,
  t,
  disableNoPrepayment = false,
}: PaymentOptionsWithRadioProps) => {
  // If no prepayment is disabled and currently selected, switch to 'pay'
  useEffect(() => {
    if (disableNoPrepayment && selectedOption === 'noPrepayment') {
      onOptionChange('pay')
    }
  }, [disableNoPrepayment, selectedOption, onOptionChange])

  return (
  <RadioGroup
    onChange={(value: PaymentOption) => onOptionChange(value)}
    value={selectedOption}
  >
    <VStack align="stretch" spacing={4}>
      <PaymentOptionCard
        value="pay"
        label={t('payPartial')}
        isSelected={selectedOption === 'pay'}
        onSelect={() => onOptionChange('pay')}
      >
        <AlertCardMultipleMessage
          messages={[
            { message: t('partialPaymentText'), hasNewLine: true },
            { message: t('minPrePaymentPercentage', {
              percentage: prepaymentInfo?.minimumAcceptablePaymentPercentage,
            }), hasNewLine: false },
            { message: t('minPrePaymentAmount', { amount: formatNumber(minPrePaymentAmount) }), hasNewLine: false },
          ]}
          status="info"
          textSize="sm"
          showIcon={false}
        />
        <Text size="sm" color="gray.600" mt={5} mb={2}>
          {t('payPartialDescription', { amount: formatNumber(minPrePaymentAmount) })}
        </Text>
        <Input
          value={paymentAmount}
          onChange={e => onAmountChange(e.target.value)}
          onFocus={onAmountFocus}
          onBlur={onAmountBlur}
          suffix
          state={errorElements ? 'invalid' : 'default'}
          rightIconName="dram"
        />
        {errorElements && (
          <Text size="xs" color="red.500" mt={1}>
            {errorElements}
          </Text>
        )}
      </PaymentOptionCard>

      <PaymentOptionCard
        value="payFull"
        label={t('payFull')}
        isSelected={selectedOption === 'payFull'}
        onSelect={() => onOptionChange('payFull')}
      >
        <Input
          value={packageDetails.price}
          isDisabled
          suffix
          state="default"
          rightIconName="dram"
        />
      </PaymentOptionCard>

      {!disableNoPrepayment && (
        <PaymentOptionCard
          value="noPrepayment"
          label={t('noPrepayment')}
          isSelected={selectedOption === 'noPrepayment'}
          onSelect={() => onOptionChange('noPrepayment')}
        >
          <Text size="sm" color="gray.600" mb={4}>
            {t('noPrepaymentTextWithDetails', {
              amount: noPrepaymentData.paymentAmount,
              dueDate: noPrepaymentData.paymentDueDate,
              days: noPrepaymentData.days,
            })}
          </Text>
          <AlertCardMessage
            message={t('partialPaymentText')}
            status="info"
            textSize="sm"
            showIcon={false}
          />
        </PaymentOptionCard>
      )}
    </VStack>
  </RadioGroup>
  )
}