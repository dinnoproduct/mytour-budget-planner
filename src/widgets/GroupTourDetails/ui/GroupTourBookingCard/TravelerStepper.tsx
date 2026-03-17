import { Flex, IconButton } from '@chakra-ui/react'
import { Button, Icon, Text } from '@ui'

type TravelerStepperProps = {
  value: number
  min?: number
  max?: number
  onChange: (n: number) => void
  label: string
  description?: string
}

export const TravelerStepper = ({
  value,
  min = 0,
  max = 2,
  onChange,
  label,
  description,
}: TravelerStepperProps) => {
  const clamped = Math.max(min, Math.min(max, value))

  const isBackButtonDisabled = clamped <= min
  const isForwardButtonDisabled = clamped >= max

  return (
    <Flex align="center" justify="space-between" width="full">
      <Flex direction="column">
        <Text size="sm" color="gray.700">
          {label}
        </Text>
        {description && (
          <Text size="xs" color="gray.500">
            {description}
          </Text>
        )}
      </Flex>
      <Flex align="center" gap={2}>
        <Button
          size="sm"
          variant="solid-gray"
          isDisabled={isBackButtonDisabled}
          onClick={() => onChange(clamped - 1)}
          aria-label="decrease"
          isActive={!isBackButtonDisabled}
          icon="remove"
        />
        <Text size="sm" fontWeight="medium" minW="24px" textAlign="center">
          {clamped}
        </Text>
        <Button
          size="sm"
          variant="solid-gray"
          isDisabled={isForwardButtonDisabled}
          onClick={() => onChange(clamped + 1)}
          aria-label="increase"
          isActive={!isForwardButtonDisabled}
          icon="add"
        />
        
      </Flex>
    </Flex>
  )
}

