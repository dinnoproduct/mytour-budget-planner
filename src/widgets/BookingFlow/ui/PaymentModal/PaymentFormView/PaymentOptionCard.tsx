import { Box, Flex } from '@chakra-ui/react'
import { Radio, Text } from '@ui'

type PaymentOptionCardProps = {
  value: string
  label: string
  isSelected: boolean
  onSelect: () => void
  children?: React.ReactNode
}

export const PaymentOptionCard = ({
  value,
  label,
  isSelected,
  onSelect,
  children,
}: PaymentOptionCardProps) => (
  <Box
    p={'16px'}
    borderWidth="1px"
    borderColor={isSelected ? 'blue.500' : 'gray.200'}
    borderRadius="16px"
    cursor="pointer"
    onClick={onSelect}
    
  >
    <Flex align="center" gap={3}>
      <Radio value={value} size="lg" />
      <Text size="sm" fontWeight="medium">
        {label}
      </Text>
    </Flex>
    {isSelected && children && <Box mt={5}>{children}</Box>}
  </Box>
)
