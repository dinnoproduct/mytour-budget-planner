import {
  Box,
  HStack,
  Image,
  LinkBox,
  IconButton,
  type LinkBoxProps
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useExternalBanners } from '@entities/notification'
import { useLanguageNavigate } from '@/hooks/useLanguageNavigate'
import { type ExternalBannerLinkType } from '@entities/notification/api/types'

export const PackageBanner: React.FC<LinkBoxProps> = ({ ...props }) => {
  const DEFAULT_AUTOPLAY_DELAY = 3000
  const USER_CHANGE_AUTOPLAY_DELAY = DEFAULT_AUTOPLAY_DELAY * 2
  const SWIPE_THRESHOLD = 40
  const { t } = useTranslation()
  const { navigateTo } = useLanguageNavigate()
  const { data: banners } = useExternalBanners()
  const homeBanners = useMemo(() => {
    const homeData = banners?.HOME ?? []
    return [...homeData].sort((firstBanner, secondBanner) =>
      firstBanner.displayOrder - secondBanner.displayOrder)
  }, [banners])
  const [slideIndex, setSlideIndex] = useState(1)
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true)
  const [autoplayDelay, setAutoplayDelay] = useState(DEFAULT_AUTOPLAY_DELAY)
  const touchStartXRef = useRef<number | null>(null)
  const touchStartYRef = useRef<number | null>(null)
  const bannersCount = homeBanners.length
  const hasCarousel = bannersCount > 1

  const realIndex = bannersCount
    ? (slideIndex - 1 + bannersCount) % bannersCount
    : 0
  const selectedBanner = homeBanners[realIndex]
  const loopedBanners = useMemo(() => {
    if (!hasCarousel) {
      return homeBanners
    }

    return [
      homeBanners[bannersCount - 1],
      ...homeBanners,
      homeBanners[0]
    ]
  }, [homeBanners, hasCarousel, bannersCount])

  const handleBannerClick = useCallback(({ link, linkType }: { link: string, linkType: ExternalBannerLinkType }) => {
    if (!link) {
      return
    }
    if (linkType === 'INTERNAL') {
      navigateTo(link)
    } else {
      window.location.href = link
    }
  }, [navigateTo])

  useEffect(() => {
    setSlideIndex(1)
    setIsTransitionEnabled(true)
    setAutoplayDelay(DEFAULT_AUTOPLAY_DELAY)
  }, [bannersCount])

  useEffect(() => {
    if (!hasCarousel) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setSlideIndex((prev) => prev + 1)
      if (autoplayDelay !== DEFAULT_AUTOPLAY_DELAY) {
        setAutoplayDelay(DEFAULT_AUTOPLAY_DELAY)
      }
    }, autoplayDelay)

    return () => window.clearTimeout(timeoutId)
  }, [hasCarousel, autoplayDelay, slideIndex])

  const handleManualSlideChange = useCallback((nextSlideIndex: number | ((current: number) => number)) => {
    setSlideIndex(nextSlideIndex)
    setAutoplayDelay(USER_CHANGE_AUTOPLAY_DELAY)
  }, [USER_CHANGE_AUTOPLAY_DELAY])

  const handleSlideSelect = (index: number) => {
    handleManualSlideChange(index + 1)
  }

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0]
    touchStartXRef.current = touch.clientX
    touchStartYRef.current = touch.clientY
  }

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!hasCarousel || touchStartXRef.current === null || touchStartYRef.current === null) {
      return
    }

    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - touchStartXRef.current
    const deltaY = touch.clientY - touchStartYRef.current
    touchStartXRef.current = null
    touchStartYRef.current = null

    if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) <= Math.abs(deltaY)) {
      return
    }

    if (deltaX > 0) {
      handleManualSlideChange((current) => current - 1)
      return
    }

    handleManualSlideChange((current) => current + 1)
  }

  const handleTrackTransitionEnd = useCallback((event: React.TransitionEvent<HTMLDivElement>) => {
    if (!hasCarousel) {
      return
    }
    if (event.target !== event.currentTarget || event.propertyName !== 'transform') {
      return
    }

    if (slideIndex === bannersCount + 1) {
      setIsTransitionEnabled(false)
      setSlideIndex(1)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsTransitionEnabled(true))
      })
      return
    }

    if (slideIndex === 0) {
      setIsTransitionEnabled(false)
      setSlideIndex(bannersCount)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsTransitionEnabled(true))
      })
    }
  }, [slideIndex, bannersCount, hasCarousel])

  if (!selectedBanner?.imageUrl) {
    return null
  }

  return (
    <Box w="100%" h="auto">
      <Box overflow="hidden" w="full">
        <Box
          display="flex"
          onTransitionEnd={handleTrackTransitionEnd}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          transition={isTransitionEnabled ? 'transform 450ms ease' : 'none'}
          transform={`translateX(-${slideIndex * 100}%)`}
        >
          {loopedBanners.map((banner, index) => (
            <LinkBox
              key={`${banner.id}-${index}`}
              as="button"
              type="button"
              onClick={() => handleBannerClick({
                link: banner.cta?.link ?? '',
                linkType: banner.cta?.linkType ?? 'INTERNAL'
              })}
              textDecoration="none"
              _hover={{ textDecoration: 'none' }}
              display="block"
              p={0}
              minW="stretch"
              {...props}
            >
              <Image
                src={banner.mobileImageUrl ?? banner.imageUrl ?? ''}
                alt={banner.title ?? t('packageBanner.title.package')}
                display={{ base: 'block', md: 'none' }}
                w="full"
                h="auto"
                objectFit="contain"
              />
              <Image
                src={banner.imageUrl ?? ''}
                alt={banner.title ?? t('packageBanner.title.package')}
                display={{ base: 'none', md: 'block' }}
                w="100%"
                h="auto"
                objectFit="contain"
              />
            </LinkBox>
          ))}
        </Box>
      </Box>

      {hasCarousel && (
        <HStack justify="center" mt={4} spacing={2}>
          {homeBanners.map((banner, index) => (
            <IconButton
              key={banner.id}
              aria-label={`Select banner ${index + 1}`}
              onClick={() => handleSlideSelect(index)}
              size="xs"
              minW="30px"
              h="6px"
              borderRadius="full"
              variant="unstyled"
              transform={index === realIndex ? 'scale(1.2)' : 'scale(.95)'}
              bg={index === realIndex ? 'blue.400' : 'gray.300'}
              _hover={{ bg: index === realIndex ? 'blue.500' : 'gray.400', transform: index === realIndex ? 'scale(1.2)' : 'scale(1)' }}
            />
          ))}
        </HStack>
      )}
    </Box>
  )
}
