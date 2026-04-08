import React from 'react'
import { Checkbox, Flex, Text } from '@chakra-ui/react'
import { MenuItem } from '@chakra-ui/react'

export const DestinationItem = ({
  option,
  isSelected,
  onToggle
}: {
  option: { key: string; label: string }
  isSelected: boolean
  onToggle: (v: string) => void
}) => {
  return (
    <MenuItem
      onClick={() => onToggle(option.key)}
      py="6px"
      px="1"
      borderRadius="8px"
      _hover={{ bg: 'gray.50' }}
    >
      <Flex align="center" width="full" gap="2">
        <Checkbox isChecked={isSelected} pointerEvents="none" colorScheme="blue" />
        <Text color={'gray.800'} fontWeight="400" fontSize="14px">
          {option.label}
        </Text>
      </Flex>
    </MenuItem>
  )
}

