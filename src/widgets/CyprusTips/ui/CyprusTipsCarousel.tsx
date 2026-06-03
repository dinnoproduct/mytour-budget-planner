'use client'

import { Box, Flex, Skeleton, useBreakpointValue } from '@chakra-ui/react'
import { type ExternalTip } from '@entities/notification'
import { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { type Swiper as SwiperType } from 'swiper'
import { type SwiperOptions } from 'swiper/types'
import 'swiper/css'
import 'swiper/css/free-mode'
import { StoryScrollArrow } from '@widgets/StoriesSection/ui/components/StoryScrollArrow'
import { CyprusTipStoryCard } from './CyprusTipStoryCard'
import {
  getTipStoryCardWidth,
  TIP_STORY_CARD_HEIGHT,
  TIP_STORY_GAP,
} from '../model/constants'

const SWIPER_BREAKPOINTS: SwiperOptions['breakpoints'] = {
  0: {
    slidesPerView: 'auto',
    spaceBetween: TIP_STORY_GAP.base,
    slidesOffsetBefore: 0,
  },
  768: {
    slidesPerView: 'auto',
    spaceBetween: TIP_STORY_GAP.md,
    slidesOffsetBefore: 0,
  },
}

type CyprusTipsCarouselProps = {
  tips: ExternalTip[]
  onTipClick: (tip: ExternalTip) => void
}

export const CyprusTipsCarousel = ({
  tips,
  onTipClick,
}: CyprusTipsCarouselProps) => {
  const swiperRef = useRef<SwiperType | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const cardHeight =
    useBreakpointValue(TIP_STORY_CARD_HEIGHT) ?? TIP_STORY_CARD_HEIGHT.base
  const cardWidth = getTipStoryCardWidth(cardHeight)
  const gap =
    useBreakpointValue(TIP_STORY_GAP) ?? TIP_STORY_GAP.base
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    const element = containerRef.current
    if (!element) {
      return
    }

    const observer = new ResizeObserver((entries) => {
      setContainerWidth(entries[0]?.contentRect.width ?? 0)
    })

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const slidesTotalWidth = tips.length * (cardWidth + gap)
  const hasOverflow = containerWidth > 0 && slidesTotalWidth > containerWidth
  const enableLoop = hasOverflow && tips.length >= 3

  return (
    <Box>
      <Box ref={containerRef} overflow="hidden" w="full">
        {hasOverflow ? (
          <Swiper
            modules={[FreeMode]}
            loop={enableLoop}
            speed={300}
            allowTouchMove
            freeMode={{
              enabled: true,
              sticky: false,
              momentum: true,
              momentumBounce: false,
            }}
            grabCursor
            breakpoints={SWIPER_BREAKPOINTS}
            onSwiper={(instance) => {
              swiperRef.current = instance
            }}
          >
            {tips.map((tip) => (
              <SwiperSlide
                key={tip.id}
                style={{
                  width: `${cardWidth}px`,
                  maxWidth: `${cardWidth}px`,
                }}
              >
                <CyprusTipStoryCard
                  tip={tip}
                  cardHeight={cardHeight}
                  onClick={() => onTipClick(tip)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <Flex gap={`${gap}px`} justify="flex-start" wrap="nowrap">
            {tips.map((tip) => (
              <CyprusTipStoryCard
                key={tip.id}
                tip={tip}
                cardHeight={cardHeight}
                onClick={() => onTipClick(tip)}
              />
            ))}
          </Flex>
        )}
      </Box>

      {hasOverflow ? (
        <Flex justify="center" align="center" gap={3} mt={6}>
          <StoryScrollArrow
            direction="left"
            onClick={() => swiperRef.current?.slidePrev()}
          />
          <StoryScrollArrow
            direction="right"
            onClick={() => swiperRef.current?.slideNext()}
          />
        </Flex>
      ) : null}
    </Box>
  )
}

export const CyprusTipsCarouselSkeleton = () => {
  const cardHeight =
    useBreakpointValue(TIP_STORY_CARD_HEIGHT) ?? TIP_STORY_CARD_HEIGHT.base
  const cardWidth = getTipStoryCardWidth(cardHeight)

  return (
    <Flex gap={4} overflow="hidden">
      {[0, 1, 2, 3, 4].map((index) => (
        <Skeleton
          key={index}
          width={`${cardWidth}px`}
          height={`${cardHeight}px`}
          rounded="2xl"
          flexShrink={0}
        />
      ))}
    </Flex>
  )
}
