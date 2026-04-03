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

  return (
    <Flex
      align="center"
      justify="space-between"
      my="1"
    >
      <Text fontSize="14px" fontWeight="semibold" color="gray.700">
        {count} {selectedText}
      </Text>
      <Button
        variant="text-blue"
        size="sm"
        onClick={onClearAll}
      >
        {clearAllText}
      </Button>
    </Flex>
  )
}

