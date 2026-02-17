import { Box } from '@chakra-ui/react'
import { AlertCardMessage, Checkbox, Input, Text } from '@ui'
import { formatNumber } from '@shared/utils'
import { PrepaymentInfo } from '@entities/package/api/types'

type SimplePaymentContentProps = {
  isFullPaymentOnly: boolean
  paymentAmount: number
  onAmountChange: (value: string | number) => void
  isPaymentInFull: boolean
  onPayInFullChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  errorElements: React.ReactNode | null
  packageDetails: { price: number }
  days: number
  minPrePaymentAmount: number
  t: (key: string, params?: Record<string, unknown>) => string
}

export const SimplePaymentContent = ({
  days,
  packageDetails,
  minPrePaymentAmount,
  t,
}: SimplePaymentContentProps) => (
  <Box mt={5}>
    <AlertCardMessage
          message={t('minPrePaymentText', { amount: formatNumber(minPrePaymentAmount) })}
          status="info"
          textSize="sm"
          showIcon={false}
        />
    <Box mt="6">
      <Text size="sm" color="gray.600">
        {t('minPrePaymentTextWithDetails', { amount: formatNumber(packageDetails.price), days })}
      </Text>
         
    </Box>
  </Box>
)
