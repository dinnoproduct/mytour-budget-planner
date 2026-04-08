import { Flex } from '@chakra-ui/react'
import { Text } from '@ui'
import { Switch } from '@/components/Switch'
import type { TFunction } from 'i18next'
import { useRequestPromoCode } from './useRequestPromoCode'

type Props = {
  showNotPaidButton: boolean
  promo: ReturnType<typeof useRequestPromoCode>
  t: TFunction
}

export const RequestCardPromoToggle = ({ showNotPaidButton, promo, t }: Props) => {
  if (!showNotPaidButton) return null

  return (
    <Flex
      p={3}
      mx={4}
      border={'1px solid'}
      borderColor={'gray.100'}
      rounded={'lg'}
      justify="space-between"
      align="center"
    >
      <Text size="sm" fontWeight={'semibold'} color="gray.800" mt="1">
        {t`iHavePromoCode`}
      </Text>
      <Switch
        isChecked={promo.hasPromoCode}
        isDisabled={promo.isApplying}
        onChange={promo.handleSwitchToggle}
      />
    </Flex>
  )
}
