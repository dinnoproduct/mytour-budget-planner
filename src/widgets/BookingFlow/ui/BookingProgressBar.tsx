import { Flex } from '@chakra-ui/react'
import { Progress, Text } from '@ui'
import { useTranslation } from 'react-i18next'

export type BookingProgressBarProps = {
  step: number
  totalSteps: number
}

export const BookingProgressBar = ({ step, totalSteps }: BookingProgressBarProps) => {
  const { t } = useTranslation()
  const safeStep = Math.min(Math.max(step, 1), totalSteps)
  const stepPercent = totalSteps > 0 ? 100 / totalSteps : 0
  const value = Math.round(safeStep * stepPercent)

  return (
    <Flex direction="column" gap={2} width="full" paddingInline={{base: 4, md: 0}}>
      <Flex justify="space-between" align="center" width="full">
        <Text size="md" color="gray.700" fontSize={'14px'} fontWeight="500">
          {t('booking.step', { step: safeStep, total: totalSteps })}
        </Text>
        <Text size="md" fontWeight="500" color="gray.700" fontSize={'14px'} >
          {value}%
        </Text>
      </Flex>
      <Progress
        value={value}
        size="sm"
        colorScheme="blue"
        borderRadius="full"
        max={100}
      />
    </Flex>
  )
}
