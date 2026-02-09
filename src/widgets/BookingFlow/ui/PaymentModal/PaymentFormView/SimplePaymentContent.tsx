import { Box } from '@chakra-ui/react'
import { Checkbox, Input, Text } from '@ui'
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

export const SimplePaymentContent = ({
  isFullPaymentOnly,
  paymentAmount,
  onAmountChange,
  isPaymentInFull,
  onPayInFullChange,
  errorElements,
  packageDetails,
  minPrePaymentAmount,
  t,
}: SimplePaymentContentProps) => (
  <Box>
    <Text size="sm" fontWeight="semibold" align="center">
      {t('minPrePaymentText', { amount: minPrePaymentAmount })}
    </Text>

    <Box mt="6">
      {isFullPaymentOnly ? (
        <Text size="sm" color="gray.600">
          {t('payFullDescription', { amount: formatNumber(packageDetails.price) })}
        </Text>
      ) : (
        <>
          <Input
            value={paymentAmount}
            onChange={e => onAmountChange(e.target.value)}
            isDisabled={isPaymentInFull}
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
            mt={4}
            onChange={onPayInFullChange}
            isChecked={isPaymentInFull}
          >
            {t('payInFull')}
          </Checkbox>
        </>
      )}
    </Box>
  </Box>
)
