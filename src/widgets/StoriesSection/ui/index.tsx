import { Box, useBreakpointValue } from '@chakra-ui/react'
import React, { useCallback, useState } from 'react'
import { useStoriesData } from './hooks'
import { StoriesContent, StoryViewerModal } from './components'
import { STORY_VIEWER_URL } from './constants'

interface StoriesSectionProps {
  isHotel?: number
}

export const StoriesSection: React.FC<StoriesSectionProps> = ({ isHotel = 0 }) => {
  const { storyGroups, isLoading, error } = useStoriesData()
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [viewerUrl, setViewerUrl] = useState<string | null>(null)

  const handleOpenStorySet = useCallback((storySetId: number) => {
    const url = `${STORY_VIEWER_URL}&id=${storySetId}`
    setViewerUrl(url)
    setIsViewerOpen(true)
  }, [])

  const handleCloseViewer = useCallback(() => {
    setIsViewerOpen(false)
    setViewerUrl(null)
  }, [])

  return (
    <>
      <Box
        px={{ base: 0, sm: 6, md: 10 }}
      >
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
        url={viewerUrl}
      />
    </>
  )
}

