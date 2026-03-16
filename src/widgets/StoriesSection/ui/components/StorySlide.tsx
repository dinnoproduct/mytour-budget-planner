import { Box, Flex } from '@chakra-ui/react'
import React from 'react'
import { type Story, type StoryGroup } from '../types'
import { StorySlideHeader } from './StorySlideHeader'
import { StorySlideFooter } from './StorySlideFooter'

interface StorySlideProps {
  story: Story
  storySet: StoryGroup['storySet']
  onClose: () => void
}

export const StorySlide: React.FC<StorySlideProps> = ({ story, storySet, onClose }) => (
  <Flex
    direction="column"
    justify="space-between"
    width="100%"
    height="100%"
    position="relative"
  >
    <Box
      as="img"
      src={story.imageUrl}
      alt={story.title}
      width="auto"
      height="100%"
      objectFit="cover"
      position="absolute"
      top={0}
      left={0}
    />

    <StorySlideHeader
      avatarUrl={storySet.avatarImageUrl}
      name={storySet.name}
      onClose={onClose}
    />

    <StorySlideFooter
      title={story.title}
      shortDescription={story.shortDescription}
      cta={story.cta}
    />
  </Flex>
)
