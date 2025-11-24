import { Flex, Spinner, Text } from '@chakra-ui/react'
import React from 'react'
import { type StoryGroup } from '../types'
import { StoriesList } from './StoriesList'

interface StoriesContentProps {
  storyGroups: StoryGroup[]
  isLoading: boolean
  error: string | null
  onOpenStorySet: (storySetId: number) => void
  isHotel?: number
}

export const StoriesContent: React.FC<StoriesContentProps> = ({
  storyGroups,
  isLoading,
  error,
  onOpenStorySet,
  isHotel = 0
}) => {
  if (isLoading) {
    return (
      <Flex justify="center" py={8}>
        <Spinner size="lg" />
      </Flex>
    )
  }

  if (error) {
    return (
      <Flex justify="center" py={8}>
        <Text color="red.500" fontWeight="medium">
          {error}
        </Text>
      </Flex>
    )
  }

  if (storyGroups.length === 0) {
    return (
      <Flex justify="center" py={8}>
        <Text color="gray.500" fontWeight="medium">
          No stories available right now.
        </Text>
      </Flex>
    )
  }

  return <StoriesList storyGroups={storyGroups} onOpenStorySet={onOpenStorySet} isHotel={isHotel} />
}

