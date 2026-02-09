import { RadioGroup, VStack } from '@chakra-ui/react'
import { AlertCardMessage, Input, Text } from '@ui'
import { formatNumber } from '@shared/utils'
import type { PaymentOption } from '../types'
import { PaymentOptionCard } from './PaymentOptionCard'

type PaymentOptionsWithRadioProps = {
  selectedOption: PaymentOption
  onOptionChange: (value: PaymentOption) => void
  paymentAmount: number
  onAmountChange: (value: string | number) => void
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
}

export const PaymentOptionsWithRadio = ({
  selectedOption,
  onOptionChange,
  paymentAmount,
  onAmountChange,
  errorElements,
  packageDetails,
  prepaymentInfo,
  minPrePaymentAmount,
  noPrepaymentData,
  t,
}: PaymentOptionsWithRadioProps) => (
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
        <AlertCardMessage
          message={`${t('minPrePaymentPercentage', {
            percentage: prepaymentInfo?.minimumAcceptablePaymentPercentage,
          })} ${t('minPrePaymentAmount', { amount: formatNumber(minPrePaymentAmount) })}`}
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
          mt={5}
          value={packageDetails.price}
          isDisabled
          suffix
          state="default"
          rightIconName="dram"
        />
      </PaymentOptionCard>

      <PaymentOptionCard
        value="noPrepayment"
        label={t('noPrepayment')}
        isSelected={selectedOption === 'noPrepayment'}
        onSelect={() => onOptionChange('noPrepayment')}
      >
        <AlertCardMessage
          message={t('noPrepaymentTextWithDetails', {
            amount: noPrepaymentData.paymentAmount,
            dueDate: noPrepaymentData.paymentDueDate,
            days: noPrepaymentData.days,
          })}
          status="info"
          textSize="sm"
          showIcon={false}
        />
      </PaymentOptionCard>
    </VStack>
  </RadioGroup>
)