import { Box, Modal, ModalContent, ModalOverlay } from '@chakra-ui/react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Stories from 'react-insta-stories'
import type { Story as InstaStory } from 'react-insta-stories/dist/interfaces'
import { type StoryGroup } from '../types'
import { StorySlide } from './StorySlide'

interface StoryViewerModalProps {
  isOpen: boolean
  onClose: () => void
  groups: StoryGroup[]
  initialGroupIndex: number
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  isOpen,
  onClose,
  groups,
  initialGroupIndex,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialGroupIndex)

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialGroupIndex)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, initialGroupIndex])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const group = groups[currentIndex] ?? null

  const handleAllStoriesEnd = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % groups.length)
  }, [groups.length])

  const stories: InstaStory[] = useMemo(() => {
    if (!group) return []
    return group.stories.map((story) => ({
      url: story.imageUrl,
      type: 'image' as const,
      content: () => (
        <StorySlide story={story} storySet={group.storySet} onClose={onClose} />
      ),
    }))
  }, [group, onClose])

  if (!groups.length || !group || !stories.length) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      closeOnOverlayClick
      closeOnEsc
      isCentered
    >
      <ModalOverlay bg="rgba(0, 0, 0, 0.8)" onClick={onClose} />
      <ModalContent
        maxW="100vw"
        maxH="100vh"
        width="100vw"
        height="100vh"
        m={0}
        borderRadius={0}
        bg="transparent"
        display="flex"
        alignItems="center"
        justifyContent="center"
        onClick={onClose}
      >
        <Box
          width={{ base: '100vw', md: '420px' }}
          height={{ base: '100vh', md: '750px' }}
          borderRadius={{ base: 0, md: '16px' }}
          overflow="hidden"
          position="relative"
          onClick={(e) => e.stopPropagation()}
        >
          <Stories
            key={group.storySet.id}
            stories={stories}
            defaultInterval={5000}
            width="100%"
            height="100%"
            onAllStoriesEnd={handleAllStoriesEnd}
            keyboardNavigation
            storyContainerStyles={{
              borderRadius: 'inherit',
              overflow: 'hidden',
            }}
          />
        </Box>
      </ModalContent>
    </Modal>
  )
}
