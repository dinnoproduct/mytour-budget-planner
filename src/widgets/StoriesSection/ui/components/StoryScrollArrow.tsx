import { IconButton } from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import React from 'react'

interface StoryScrollArrowProps {
  direction: 'left' | 'right'
  onClick: () => void
}

export const StoryScrollArrow: React.FC<StoryScrollArrowProps> = ({
  direction,
  onClick
}) => {
  return (
    <IconButton
      aria-label={`Scroll ${direction}`}
      icon={
        direction === 'left' ? (
          <ChevronLeftIcon boxSize="20px" />
        ) : (
          <ChevronRightIcon boxSize="20px" />
        )
      }
      onClick={onClick}
      borderRadius="full"
      // width="34px"
      // height="34px"
      size="md"
      bg="blue.50"
      color="blue.500"
      _hover={{ bg: 'blue.100' }}
      _active={{ bg: 'blue.200' }}
      flexShrink={0}
    />
  )
}

