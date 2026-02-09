import { Box } from '@chakra-ui/react'
import { AlertCardMessage, Checkbox, Input, Text } from '@ui'
import { formatNumber } from '@shared/utils'

type SimplePaymentContentProps = {
  isFullPaymentOnly: boolean
  paymentAmount: number
  onAmountChange: (value: string | number) => void
  isPaymentInFull: boolean
  onPayInFullChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  errorElements: React.ReactNode | null
  packageDetails: { price: number }
  minPrePaymentAmount: number
  t: (key: string, params?: Record<string, unknown>) => string
}

const DAYS_COUNT_FOR_PARTIAL_PAYMENT = 40

export const SimplePaymentContent = ({
  packageDetails,
  minPrePaymentAmount,
  t,
}: SimplePaymentContentProps) => (
  <Box>
    <AlertCardMessage
          message={t('minPrePaymentText', { amount: formatNumber(minPrePaymentAmount) })}
          status="info"
          textSize="sm"
          showIcon={false}
        />

    <Box mt="6">
      <Text size="sm" color="gray.600">
        {t('minPrePaymentTextWithDetails', { amount: formatNumber(packageDetails.price), days: DAYS_COUNT_FOR_PARTIAL_PAYMENT })}
      </Text>
         
    </Box>
  </Box>
)
