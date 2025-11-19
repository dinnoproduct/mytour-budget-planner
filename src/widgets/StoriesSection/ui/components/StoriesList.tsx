import { Box, Flex, useMediaQuery } from '@chakra-ui/react'
import React, { useMemo, useRef } from 'react'
import { useBreakpointValue } from '@chakra-ui/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { type Swiper as SwiperType } from 'swiper'
import { type SwiperOptions } from 'swiper/types'
import 'swiper/css'
import 'swiper/css/navigation'
import { type StoryGroup } from '../types'
import { StoryItem } from './StoryItem'
import { StoryScrollArrow } from './StoryScrollArrow'

interface StoriesListProps {
  storyGroups: StoryGroup[]
  onOpenStorySet: (storySetId: number) => void
  isHotel?: number
}

export const StoriesList: React.FC<StoriesListProps> = ({
  storyGroups,
  onOpenStorySet,
  isHotel = 0
}) => {
  const swiperRef = useRef<SwiperType | null>(null)
  const [isMdUp] = useMediaQuery('(min-width: 48em)')
  const showArrowControls = isMdUp
  const slideWidth = useBreakpointValue({ base: 80, sm: 100 }) ?? 80

  const swiperBreakpoints: SwiperOptions['breakpoints'] = useMemo(
    () => ({
      0: {
        slidesPerView: 'auto' as const,
        spaceBetween: 32,
        slidesOffsetBefore: 16
      },
      768: {
        slidesPerView: 'auto' as const,
        spaceBetween: 40,
        slidesOffsetBefore: 0
      },
      1024: {
        slidesPerView: 'auto' as const,
        spaceBetween: 40
      }
    }),
    []
  )

  return (
    <Flex gap={{ base: 2, xs: 3, md: 4 }} align="flex-start">
      {showArrowControls && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height={{ base: 20, md: '108px' }}
        >
          <StoryScrollArrow direction="left" onClick={() => swiperRef.current?.slidePrev()} />
        </Box>
      )}

      <Box
        flex={1}
        px={{ base: 0, md: 2 }}
        py={2}
        overflow="hidden"
      >
        <Swiper
          modules={[Navigation]}
          loop
          speed={400}
          allowTouchMove
          breakpoints={swiperBreakpoints}
          onSwiper={(instance) => {
            swiperRef.current = instance
        }}
      >
          {storyGroups.map((group) => (
            <SwiperSlide
              key={group.storySet.id}
              style={{
                width: `${slideWidth}px`,
                maxWidth: `${slideWidth}px`,
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <StoryItem group={group} onOpen={onOpenStorySet} isHotel={isHotel} />
            </SwiperSlide>
        ))}
        </Swiper>
      </Box>

      {showArrowControls && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height={{ base: 20, md: '100px' }}
        >
          <StoryScrollArrow direction="right" onClick={() => swiperRef.current?.slideNext()} />
        </Box>
      )}
    </Flex>
  )
}

