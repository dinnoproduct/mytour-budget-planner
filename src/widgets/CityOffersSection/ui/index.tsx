import {
  Box,
  type BoxProps,
  Heading,
  Text,
  SimpleGrid,
  IconButton,
  Flex,
  type LinkBoxProps,
  Link,
  useBreakpointValue,
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import React, { type ReactNode, useMemo, useRef, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useFlightDates } from '@entities/package/hooks/useFlightDates'
import {
  useCities,
  useHotelPackagesSearchContext,
} from '@entities/package'
import {
  countryCards, 
  packageCards as baseCityCards,
} from '@/constants/constants'
import { LANGUAGE_PREFIX, type LanguageName } from '@shared/model'
import {fmt} from "@/utils/methods";
import { useLanguageRouting } from '@/hooks/useLanguageRouting';
import { Icon } from '@/shared/ui'

export interface PackageCountry {
  id: number
  nameArm: string
  nameEng: string
  nameRus: string
}

type cardType = 'hotel' | 'package'

type NameKey = 'nameArm' | 'nameEng' | 'nameRus'

interface CityOffersSectionProps extends LinkBoxProps {
  /** Tab index from home page: 0 = hotels, 1 = packages, 2 = group tours */
  isHotel: number
}

export const CityOffersSection: React.FC<CityOffersSectionProps> = ({
  isHotel,
  ...props
}) => {
  const { data: dates = { flightStartDate: '', flightReturnDate: '' } } =
    useFlightDates()
  const { i18n, t } = useTranslation()
  const { cities } = useHotelPackagesSearchContext()
  const { data: packageCities = [] } = useCities()
  const { data: data = {flightStartDate: '', flightReturnDate: '', returnFlightId: '', startFlightId: ''}} = useFlightDates()
  const { getPathWithLanguage } = useLanguageRouting()

  const nameKey = useMemo(
    () =>
      (`name${
        LANGUAGE_PREFIX[i18n.language as LanguageName]
      }` as NameKey),
    [i18n.language]
  )

  const cards = useMemo(() => {
    const pickName = <T extends { nameArm: string; nameEng: string; nameRus: string }>(
      obj?: T
    ) => (obj ? (obj as any)[nameKey] ?? obj.nameEng : '')

    
    const countryMap = new Map<number, PackageCountry>()
    const countryCityIdsMap = new Map<number, number[]>()

    cities.forEach((c: any) => {
      const cnt = c?.country
      if (!cnt) return

      countryMap.set(cnt.id, {
        id: cnt.id,
        nameArm: cnt.nameArm,
        nameEng: cnt.nameEng,
        nameRus: cnt.nameRus,
      })

      const list = countryCityIdsMap.get(cnt.id) ?? []
      list.push(c.id)
      countryCityIdsMap.set(cnt.id, list)
    })

    const tempCards = countryCards.map((card) => {
      const country = countryMap.get(card.countryId)
      const countryName = pickName(country)

      // Derive city ids for this country from actual cities list.
      // If backend mapping changed, this keeps us in sync.
      const derivedCityIds = countryCityIdsMap.get(card.countryId) ?? []

      // Fallback to legacy constant if nothing was derived.
      const legacyCityValue = decodeURIComponent(card.cities)
      const cityParam =
        derivedCityIds.length > 0 ? derivedCityIds.join(',') : legacyCityValue

      return {
        id: card.countryId,
        image: card.image,
        titleLeft: countryName,
        titleRight: '',
        cityParam,
        type: 'hotel' as cardType,
      }
    })
    
    tempCards.push(...baseCityCards.map((card) => {
      const city =
        packageCities.find((c: any) => c.id === card.id) ||
        cities.find((c: any) => c.id === card.id)

      const countryName = pickName(city?.country)
      const cityName = pickName(city as any)

      const cityId = city?.id ?? card.id

      return {
        id: cityId,
        image: card.image,
        titleLeft: countryName,
        titleRight: cityName,
        cityParam: String(cityId),
        type: 'package' as cardType
      }
    }))

    return tempCards
  }, [cities, packageCities, nameKey])

  const date = new Date()
  const firstOfTarget = new Date(date.getFullYear(), date.getMonth() + 2, 1)
  const lastOfTarget = new Date(date.getFullYear(), date.getMonth() + 3, 0)

  // Base dates for hotel-type cards (approximate future window)
  const hotelDateFrom = fmt(firstOfTarget)?.slice(0, 10)
  const hotelDateTo = fmt(lastOfTarget)?.slice(0, 10)

  // Base dates for package-type cards (use actual flight dates when available)
  const packageDateFrom = data.flightStartDate?.slice(0, 10)
  const packageDateTo = data.flightReturnDate?.slice(0, 10)

  // Carousel rendering just needs *some* dates to be present; use hotel window for that check
  const hasDates = Boolean(hotelDateFrom && hotelDateTo)
  const isMobile = useBreakpointValue({ base: true, md: false }) ?? false

  const carouselCards = useMemo(() => cards.filter((c) => c.id !== 2), [cards])
  const GAP_PX = isMobile ? 16 : 24
  const MOBILE_CARD_WIDTH = 330
  const containerRef = useRef<HTMLDivElement>(null)
  const [itemWidth, setItemWidth] = useState(0)
  const effectiveWidth = isMobile ? MOBILE_CARD_WIDTH : itemWidth || 280
  const slotWidth = effectiveWidth + GAP_PX
  const isInfinite = hasDates && carouselCards.length > 3
  const displayCards = useMemo(
    () =>
      isMobile ? carouselCards : (isInfinite ? [...carouselCards, ...carouselCards] : carouselCards),
    [carouselCards, isInfinite, isMobile]
  )
  const [activeIndex, setActiveIndex] = useState(0)
  const [transitionOn, setTransitionOn] = useState(true)
  const activeIndexRef = useRef(0)
  activeIndexRef.current = activeIndex
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const autoPlayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const n = carouselCards.length

  useEffect(() => {
    const el = containerRef.current
    if (!el || isMobile) return
    const updateWidth = () => {
      const w = el.offsetWidth
      setItemWidth((w - GAP_PX * 2) / 3)
    }
    updateWidth()
    const ro = new ResizeObserver(updateWidth)
    ro.observe(el)
    return () => ro.disconnect()
  }, [hasDates, isMobile])

  useEffect(() => {
    if (!isInfinite || n === 0 || !isAutoPlay || isMobile) return
    const id = setInterval(() => {
      const i = activeIndexRef.current
      if (i >= n) {
        setTransitionOn(false)
        setActiveIndex(0)
        setTimeout(() => setTransitionOn(true), 50)
      } else {
        setActiveIndex(i + 1)
      }
    }, 2000)
    return () => clearInterval(id)
  }, [isInfinite, n, isAutoPlay, isMobile])

  useEffect(() => {
    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current)
      }
    }
  }, [])

  const pauseAutoPlay = () => {
    setIsAutoPlay(false)
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current)
    }
    autoPlayTimeoutRef.current = setTimeout(() => {
      setIsAutoPlay(true)
    }, 5000)
  }

  const goPrev = () => {
    pauseAutoPlay()
    if (!isInfinite) return

    setActiveIndex((prev) => {
      const current = prev >= n ? prev - n : prev

      if (current === 0) {
        setTransitionOn(false)
        setActiveIndex(n)
        requestAnimationFrame(() => {
          setTransitionOn(true)
          setActiveIndex(n - 1)
        })
        return n
      }

      return current - 1
    })
  }

  const goNext = () => {
    pauseAutoPlay()
    if (!isInfinite) return
    if (activeIndex >= n) {
      setTransitionOn(false)
      setActiveIndex(0)
      setTimeout(() => setTransitionOn(true), 50)
    } else {
      setActiveIndex((i) => i + 1)
    }
  }

  return (
    <Layout {...props}>
      <Heading
        as="h3"
        fontSize={{ base: '2xl', md: '4xl' }}
        mb={{ base: 6, md: 10 }}
        ml={{ base: 4, md: 0 }}
      >
        {t`otherOffers`}
      </Heading>

      {!hasDates ? (
        isMobile ? (
          <Box overflowX="hidden" width="100%">
            <Flex gap={`${GAP_PX}px`} width="max-content">
              {[0, 1, 2].map((i) => (
                <Box
                  key={i}
                  flexShrink={0}
                  w={`${MOBILE_CARD_WIDTH}px`}
                  minW={`${MOBILE_CARD_WIDTH}px`}
                  ml={i === 0 ? '16px' : 0}
                  mr={i === 2 ? '16px' : 0}
                >
                  <SkeletonCard cardLike />
                </Box>
              ))}
            </Flex>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {Array.from({ length: 3 }).map((_, i) => (
              <React.Fragment key={`skeleton-${i}`}>
                <SkeletonCard />
              </React.Fragment>
            ))}
          </SimpleGrid>
        )
      ) : (
        <Box position="relative" ref={containerRef}>
          <Box
            overflowX={isMobile ? 'auto' : 'hidden'}
            overflowY="hidden"
            width="100%"
            sx={
              isMobile
                ? {
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    '&::-webkit-scrollbar': { display: 'none' },
                  }
                : undefined
            }
          >
            <Flex
              gap={`${GAP_PX}px`}
              transition={isMobile ? undefined : (transitionOn ? 'transform 0.35s ease-out' : 'none')}
              transform={isMobile ? undefined : `translateX(-${activeIndex * slotWidth}px)`}
              width="max-content"
            >
              {displayCards.map((card, idx) => {
              const isHotelCard = card.type === 'hotel'

              // Pick dates based purely on card type:
              // - hotel cards: always use approximate hotel window
              // - package cards: prefer real flight dates, fall back to hotel window if missing
              const from = isHotelCard ? hotelDateFrom : (packageDateFrom || hotelDateFrom)
              const to = isHotelCard ? hotelDateTo : (packageDateTo || hotelDateTo)

              // Build URL query params safely to avoid broken links.
              const params = new URLSearchParams()
              if (from) params.set('from', from)
              if (to) params.set('to', to)
              const rawCityParam = String(card.cityParam)
              params.set('city', rawCityParam)
              params.set('adultsCount', '2')
              params.set('childrenCount', '0')
              params.set('childrenAges', '')

              if (!isHotelCard && data?.startFlightId && data?.returnFlightId) {
                params.set('departureFlightId', String(data.startFlightId))
                params.set('returnFlightId', String(data.returnFlightId))
              }

              // For hotel cards we use 7 days and approximate mode; for package cards 6 days.
              params.set('days', isHotelCard ? '7' : '6')
              if (isHotelCard) {
                params.set('dateMode', 'approximate')
              }
              params.set('tab', isHotelCard ? 'hotel' : 'packages')

              const href = getPathWithLanguage(`/packages?${params.toString()}`)

              return (
              <Link
                    key={`${isHotelCard ? 'country' : 'city'}-${card.id}-${idx}`}
                    flexShrink={0}
                    w={`${effectiveWidth}px`}
                    minW={`${effectiveWidth}px`}
                    ml={isMobile && idx === 0 ? '16px' : 0}
                    mr={isMobile && idx === displayCards.length - 1 ? '16px' : 0}
                    position="relative"
                    borderRadius="12px"
                    overflow="hidden"
                    role="group"
                    minH={{ base: '196px', sm: '362px' }}
                    href={href}
                    _before={{
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      bgImage: `url('${card.image}')`,
                      bgSize: 'cover',
                      bgPos: 'center',
                      filter: 'auto',
                      brightness: '0.9',
                      transition: 'transform .4s ease',
                      transform: 'scale(1)',
                    }}
                    _after={{
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      bgGradient:
                        'linear(to-b, blackAlpha.300 0%, blackAlpha.400 40%, blackAlpha.700 100%)',
                    }}
                    _hover={{
                      _before: { transform: 'scale(1.03)' },
                    }}
                  >
                    <Flex
                      position="relative"
                      zIndex={1}
                      direction="column"
                      justify="flex-end"
                      h="full"
                      p={{ base: 4, md: 6 }}
                      gap={2}
                    >
                      <Box>
                        <Heading
                          as="h4"
                          fontSize={{ base: 'xl', md: '2xl' }}
                          color="white"
                        >
                          {card.titleLeft}
                          {card.titleRight ? ` | ${card.titleRight}` : ''}
                        </Heading>

                        <IconButton
                          height={{ base: '24px', sm: '40px' }}
                          width={{ base: '24px', sm: '40px' }}
                          minWidth="initial"
                          aria-label="View offer"
                          icon={<ChevronRightIcon boxSize={{ base: '16px', md: '24px' }} />}
                          color="white"
                          position="absolute"
                          right={{ base: 4, md: 6 }}
                          transform="translateY(-50%)"
                          rounded="full"
                          bg="whiteAlpha.400"
                          _hover={{ pointerEvents: 'none' }}
                          _focus={{ pointerEvents: 'none' }}
                        />
                      </Box>
                      <Text color="whiteAlpha.900" fontSize={{ base: 'sm', md: 'md' }}>
                        {t`included`} • {!isHotelCard ? (<>{t`flight`} + {t`hotel`}</>) : t`hotel`}
                      </Text>
                    </Flex>
                  </Link>
                )
              })}
            </Flex>
          </Box>

          {isInfinite && (
            <Box display={{ base: 'none', md: 'flex'}} alignItems='center' justifyContent='center' gap={4} mt={6}>
              <IconButton
                aria-label="Previous offers"
                icon={<Icon name='chevron-left' color={'blue.500'} />}
                size="md"
                bg="white"
                variant='outline'
                borderColor={'blue.500'}
                onClick={goPrev}
              />
              <IconButton
                aria-label="Next offers"
                icon={<Icon name='chevron-right' color={'blue.500'} />}
                size="md"
                borderColor={'blue.500'}
                variant='outline'
                bg="white"
                onClick={goNext}
              />
            </Box>
          )}
        </Box>
      )}
    </Layout>
  )
}

const SkeletonCard = ({ cardLike }: { cardLike?: boolean }) => (
  <Box
    rounded={cardLike ? '12px' : 'lg'}
    minH={cardLike ? '196px' : { base: '180px', md: '362px' }}
    bg="gray.200"
    _dark={{ bg: 'gray.700' }}
    animation="pulse 2s infinite"
  />
)

const Layout = ({
                  children,
                  ...props
                }: { children: ReactNode | ReactNode[] } & BoxProps) => (
  <Box px={{ base: 0, md: 10 }} {...props}>
    <Box mx="auto">
      <Box>{children}</Box>
    </Box>
  </Box>
)
