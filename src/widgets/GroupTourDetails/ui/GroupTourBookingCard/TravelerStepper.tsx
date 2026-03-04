import { Flex, IconButton } from '@chakra-ui/react'
import { Button, Icon, Text } from '@ui'

type TravelerStepperProps = {
  value: number
  min?: number
  max?: number
  onChange: (n: number) => void
  label: string
}

export const TravelerStepper = ({
  value,
  min = 0,
  max = 9,
  onChange,
  label,
}: TravelerStepperProps) => {
  const clamped = Math.max(min, Math.min(max, value))

  const isBackButtonDisabled = clamped <= min
  const isForwardButtonDisabled = clamped >= max

  return (
    <Flex align="center" justify="space-between" width="full">
      <Text size="sm" color="gray.700">
        {label}
      </Text>
      <Flex align="center" gap={2}>
        <IconButton
          size="sm"
          variant="solid"
          isDisabled={isBackButtonDisabled}
          onClick={() => onChange(clamped - 1)}
          aria-label="decrease"
          isActive={!isBackButtonDisabled}
        >
          <Icon name="remove" size="16" color="gray.500" />
        </IconButton>
        <Text size="sm" fontWeight="medium" minW="24px" textAlign="center">
          {clamped}
        </Text>
        <IconButton
          size="sm"
          variant="solid"
          isDisabled={isForwardButtonDisabled}
          onClick={() => onChange(clamped + 1)}
          aria-label="increase"
          isActive={!isForwardButtonDisabled}
        >
          <Icon name="add" size="16" color="gray.500" />
        </IconButton>
      </Flex>
    </Flex>
  )
}

