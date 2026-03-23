import { VStack, Flex } from '@chakra-ui/react'
import { Button, Text } from '@ui'
import { formatNumber } from '@shared/utils'
import type { TFunction } from 'i18next'
import type { RequestCardProps } from './types'
import { useRequestPromoCode } from './useRequestPromoCode'

type Props = {
  request: RequestCardProps['request']
  promo: ReturnType<typeof useRequestPromoCode>
  t: TFunction
  showRemainingPaymentButton: boolean
  showContinueButton: boolean
  showNotPaidButton: boolean
  onRemainingPaymentClick?: (
    req: RequestCardProps['request'],
    promo?: { code: string; discountedFullPrice: number }
  ) => void
  onContinueClick?: (req: RequestCardProps['request']) => void
  isLoadingRemainingPayment?: boolean
  isLoadingContinue?: boolean
}

export const RequestCardActions = ({
  request,
  promo,
  t,
  showRemainingPaymentButton,
  showContinueButton,
  showNotPaidButton,
  onRemainingPaymentClick,
  onContinueClick,
  isLoadingRemainingPayment,
  isLoadingContinue,
}: Props) => {
  if (!showRemainingPaymentButton && !showContinueButton && !showNotPaidButton) {
    return null
  }

  const handlePayClick = () => {
    if ((showRemainingPaymentButton || showNotPaidButton) && onRemainingPaymentClick) {
      const promoPayload =
        promo.promoApplied && promo.discountedRemainingAmount != null
          ? {
              code: promo.promoCode,
              discountedFullPrice: promo.discountedRemainingAmount
            }
          : undefined
      onRemainingPaymentClick(request, promoPayload)
    } else if (onContinueClick) {
      onContinueClick(request)
    }
  }

  return (
    <VStack px="4" pb="4" align="stretch" spacing="2">
      {(showRemainingPaymentButton || showNotPaidButton) && (
        <Flex
          justify="space-between"
          align="center"
          pt={4}
          mb={2}
          mt={4}
          borderTop={'1px solid'}
          borderColor={'gray.100'}
        >
          <Text size="xs" color="gray.600" fontWeight="normal">
            {t`remainingPayment`}
          </Text>
          <Flex align="center" gap={2}>
            {promo.promoApplied &&
              promo.discountedRemainingAmount !== null && (
                <Text
                  size="xs"
                  color="#FE3A5D"
                  fontWeight="medium"
                  textDecoration="line-through"
                >
                  {formatNumber(request.remainingPaymentAmount)}֏
                </Text>
              )}
            <Text size="md" color="black" fontWeight="bold">
              {formatNumber(promo.effectiveRemainingAmount)}֏
            </Text>
          </Flex>
        </Flex>
      )}

      {(showRemainingPaymentButton || showNotPaidButton) && (
        <Button
          width="full"
          onClick={handlePayClick}
          isLoading={isLoadingRemainingPayment || isLoadingContinue}
        >
          {t`pay`}
        </Button>
      )}

      {showContinueButton && (
        <Button
          width="full"
          onClick={() => onContinueClick && onContinueClick(request)}
          isLoading={isLoadingContinue}
        >
          {t`continue`}
        </Button>
      )}
    </VStack>
  )
}

