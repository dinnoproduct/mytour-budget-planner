import { Box } from '@chakra-ui/react'
import React, { useCallback, useState } from 'react'
import { useStoriesData } from './hooks'
import { StoriesContent, StoryViewerModal } from './components'

interface StoriesSectionProps {
  isHotel?: number
}

export const StoriesSection: React.FC<StoriesSectionProps> = ({ isHotel = 0 }) => {
  const { storyGroups, isLoading, error } = useStoriesData()
  console.log('StoriesSection data:', { storyGroups, isLoading, error })
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [activeGroupIndex, setActiveGroupIndex] = useState(0)

  const handleOpenStorySet = useCallback((storySetId: number) => {
    const index = storyGroups.findIndex((g) => g.storySet.id === storySetId)
    setActiveGroupIndex(index !== -1 ? index : 0)
    setIsViewerOpen(true)
  }, [storyGroups])

  const handleCloseViewer = useCallback(() => {
    setIsViewerOpen(false)
  }, [])

  return (
    <>
      <Box px={{ base: 0, sm: 6, md: 10 }}>
        <Box mx="auto">
          <StoriesContent
            storyGroups={storyGroups}
            isLoading={isLoading}
            error={error}
            onOpenStorySet={handleOpenStorySet}
            isHotel={isHotel}
          />
        </Box>
      </Box>

      <StoryViewerModal
        isOpen={isViewerOpen}
        onClose={handleCloseViewer}
        groups={storyGroups}
        initialGroupIndex={activeGroupIndex}
      />
    </>
  )
}
