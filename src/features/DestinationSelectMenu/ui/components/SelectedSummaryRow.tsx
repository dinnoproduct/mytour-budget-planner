import React from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { Button } from '@ui'

export const SelectedSummaryRow = ({
  count,
  onClearAll,
  selectedText,
  clearAllText
}: {
  count: number
  onClearAll: () => void
  selectedText: string
  clearAllText: string
}) => {
  const maxHeight = count > 0 ? '30px' : '0'

  return (
    <Flex
      align="center"
      justify="space-between"
      my="1"
      overflow="hidden"
      maxHeight={maxHeight}
      transition="max-height 0.3s ease-in-out"
    >
      <Text fontSize="14px" fontWeight="semibold" color="gray.700">
        {count} {selectedText}
      </Text>
      <Button
        variant="text-blue"
        size="sm"
        onClick={onClearAll}
        isDisabled={count === 0}
      >
        {clearAllText}
      </Button>
    </Flex>
  )
}

