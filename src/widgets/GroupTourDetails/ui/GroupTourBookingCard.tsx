import { Box, Flex, VStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useMemo, useState, useEffect } from 'react'
import { Button, Icon, Text } from '@ui'
import { CardSectionLayout } from '@/shared/ui/layout/CardSectionLayout'
import { useBreakpoint } from '@shared/hooks'
import type { GroupTourInfo, GroupTourDeparture } from '@entities/package'
import { useGroupTourOfferPrice } from '@entities/package'
import { useSetRecoilState } from 'recoil'
import { bookingContextAtom } from '@/modules/packages/store/store'
import { useLanguageNavigate } from '@/hooks/useLanguageNavigate'
import { CURRENCY_MAP, LANGUAGE_PREFIX, type LanguageName } from '@shared/model'
import {
  getValidDepartures,
} from '../lib/utils'
import { TravelersSection } from './GroupTourBookingCard/TravelersSection'
import { RoomTypeSection } from './GroupTourBookingCard/RoomTypeSection'
import { DatesSection } from './GroupTourBookingCard/DatesSection'
import { formatNumber } from '@/shared/utils'

const MAX_INFANTS = 2

type GroupTourBookingCardProps = {
  groupTour: GroupTourInfo
  containerRef?: React.RefObject<HTMLDivElement | null>
}

export const GroupTourBookingCard = ({ groupTour, containerRef }: GroupTourBookingCardProps) => {
  const { t, i18n } = useTranslation()
  const { isMd } = useBreakpoint()
  const setBookingContext = useSetRecoilState(bookingContextAtom)
  const { navigateToBooking } = useLanguageNavigate()
  const [isFixed, setIsFixed] = useState(false)
  const languageSuffix = useMemo(
    () => (LANGUAGE_PREFIX[i18n.language as LanguageName] ?? 'eng').toLowerCase(),
    [i18n.language]
  )

  const validDepartures = useMemo(
    () => getValidDepartures(groupTour.departures),
    [groupTour.departures]
  )
  const noValidDepartures = validDepartures.length === 0
  const autoSelectDeparture = validDepartures.length === 1

  const [selectedDepartureIndex, setSelectedDepartureIndex] = useState<number>(0)
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<number | ''>('')
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)

  const infantsAllowed = groupTour.travelers?.infantsAllowed || false
  const roomTypes = groupTour.roomTypes ?? []
  const travelersInfo = groupTour.travelers

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef?.current && isMd) {
        const layoutTop = containerRef.current.getBoundingClientRect().top
        if (layoutTop <= 100 && !isFixed) {
          setIsFixed(true)
        } else if (layoutTop > 100 && isFixed) {
          setIsFixed(false)
        }
      }
    }

    if (!isMd) {
      setIsFixed(false)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isFixed, isMd, containerRef?.current])

  useEffect(() => {
    if (autoSelectDeparture) setSelectedDepartureIndex(0)
  }, [autoSelectDeparture])

  useEffect(() => {
    if (validDepartures.length > 0 && selectedDepartureIndex >= validDepartures.length) {
      setSelectedDepartureIndex(0)
    }
  }, [validDepartures.length, selectedDepartureIndex])

  useEffect(() => {
    if (roomTypes.length > 0 && selectedRoomTypeId === '') {
      setSelectedRoomTypeId(roomTypes[0].id)
    }
  }, [roomTypes, selectedRoomTypeId])

  const selectedRoom = roomTypes.find((r) => r.id === selectedRoomTypeId)
  const totalTravelers = adults + children

  const rawGuestsMin = selectedRoom?.guests?.minCount ?? 0
  const rawGuestsMax = selectedRoom?.guests?.maxCount ?? 0
  const guestsMax = rawGuestsMax > 0 ? rawGuestsMax : 2
  const isFixedSingle = rawGuestsMin === 1 && rawGuestsMax === 1
  const isFixedDouble = rawGuestsMin === 2 && rawGuestsMax === 2

  // Reset travelers when room type changes according to guests rules
  useEffect(() => {
    if (!selectedRoom) return
    if (isFixedSingle) {
      setAdults(1)
      setChildren(0)
    } else if (isFixedDouble) {
      setAdults(2)
      setChildren(0)
    } else {
      // generic default: minGuests adults, zero children
      setAdults(Math.max(1, rawGuestsMin))
      setChildren(0)
    }
  }, [selectedRoomTypeId, isFixedSingle, isFixedDouble, rawGuestsMin])

  const showChildSelector = !isFixedSingle
  const showInfantSelector = infantsAllowed

  const adultMin = 1
  const adultMax = isFixedSingle ? 1 : Math.min(guestsMax, 9)
  const childMin = 0
  const childMax = isFixedSingle ? 0 : Math.max(0, guestsMax - adultMin)
  const infantMax = infantsAllowed ? MAX_INFANTS : 0

  const adultsAgeText =
    travelersInfo && travelersInfo.adultMinAge
      ? `${travelersInfo.adultMinAge}+ ${t('age')}`
      : undefined
  const childrenAgeText =
    travelersInfo && travelersInfo.childMaxAge
      ? `${travelersInfo.infantMaxAge}-${travelersInfo.childMaxAge} ${t('age')}`
      : undefined
  const infantsAgeText =
    travelersInfo && travelersInfo.infantMaxAge
      ? `0-${travelersInfo.infantMaxAge} ${t('age')}`
      : undefined

  const validationError = useMemo((): string | null => {
    if (noValidDepartures) return null
    if (validDepartures.length > 0 && selectedDepartureIndex < 0) return t('groupTour.validation.selectDeparture')
    if (adults < 0 || children < 0 || infants < 0) return t('groupTour.validation.invalidTravelers')
    if (adults < 1) return t('groupTour.validation.invalidTravelers')
    if (isFixedSingle) {
      if (!(adults === 1 && children === 0)) return t('groupTour.validation.invalidTravelers')
    } else {
      if (totalTravelers > guestsMax) return t('groupTour.validation.invalidTravelers')
    }
    if (infants > infantMax) return t('groupTour.validation.invalidTravelers')
    return null
  }, [
    noValidDepartures,
    validDepartures.length,
    selectedDepartureIndex,
    adults,
    children,
    infants,
    totalTravelers,
    guestsMax,
    infantMax,
    t,
    isFixedSingle,
  ])

  const selectedDeparture: GroupTourDeparture | null =
    validDepartures[selectedDepartureIndex] ?? null

  const isSingleSeatLeft = Number(selectedDeparture?.availableSeats ?? 0) === 1

  useEffect(() => {
    if (!isSingleSeatLeft) return
    setAdults(1)
    setChildren(0)
  }, [isSingleSeatLeft])
  const canProceed =
    !noValidDepartures && selectedDeparture !== null && validationError === null

  const offerPriceParams = selectedDeparture
    ? {
        tourId: groupTour.id,
        adult: adults,
        child: children,
        infant: infants,
        roomType: selectedRoomTypeId || groupTour.roomTypes[0].id,
      }
    : null

  const { data: offerPrice, isLoading: isLoadingOfferPrice } = useGroupTourOfferPrice(offerPriceParams)

  const handleBook = () => {
    if (!canProceed) return
    if (!offerPrice || !selectedDeparture) return

    const defaultTravelers = {
      adults: Array.from({ length: adults }).map(() => ({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
      })),
      children: Array.from({ length: children + infants }).map(() => ({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
      })),
    }

    const selectedRoomId =
      selectedRoomTypeId !== '' ? Number(selectedRoomTypeId) : groupTour.roomTypes?.[0]?.id;

    setBookingContext({
      packageDetails: {
        // minimal shape needed by BookingFlow; using group tour data
        ...groupTour,
        // ensure booking flow prepayment gets correct agency id
        travelAgency: {
          id: Number(groupTour.agency.id),
        } as any,
        // use selected departure dates as booking dates in the flow
        checkin: selectedDeparture.startDate,
        checkout: selectedDeparture.endDate,
        price: offerPrice.price,
        currency: offerPrice.currency,
        bookingType: 3,
        // selected room type for create/update request and book
        roomType: selectedRoomId ?? 0,
        adultTravelers: adults,
        childrenTravelers: children,
        infantTravelers: infants,
      } as any,
      childrenAges: [], // not used for group tours yet
      initialView: 'travelers',
      defaultTravelers,
      request: null,
      isBooked: false,
      // groupId can be carried via notes-like field
    })

    navigateToBooking()
  }

  const currencyLabel =
    CURRENCY_MAP[offerPrice?.currency as keyof typeof CURRENCY_MAP] ||
    groupTour.currency;

  return (
    <Box
      width={{ base: 'full', md: '400px' }}
      ml={{ md: 6 }}
      mt={{ base: '5', md: '0' }}
      flexShrink={0}
    >
      <Box
        width={{ base: 'full', md: '400px' }}
        bgColor="white"
        rounded={{ base: 'none', md: 'md' }}
        overflow="hidden"
        position={isFixed ? 'fixed' : 'static'}
        top={isFixed ? '90px' : 'auto'}
      >
        <CardSectionLayout
          px="4"
          py="4"
          gridArea="totalPrice"
          width="full"
        >
          <VStack align="stretch" spacing={0} >
            <DatesSection
              label={t('groupTour.dates')}
              noValidDepartures={noValidDepartures}
              validDepartures={validDepartures}
              selectedDepartureIndex={selectedDepartureIndex}
              onChangeSelectedDepartureIndex={setSelectedDepartureIndex}
              noAvailableLabel={t('noAvailableDepartures')}
            />

            {/* Travelers */}
            <TravelersSection
              title={t('travelers')}
              adults={adults}
              children={children}
              infants={infants}
              setAdults={setAdults}
              setChildren={setChildren}
              setInfants={setInfants}
              adultMin={adultMin}
              adultMax={adultMax}
              childMin={childMin}
              childMax={childMax}
              infantMax={infantMax}
              showChildSelector={showChildSelector}
              showInfantSelector={showInfantSelector ?? false}
              guestsMax={guestsMax}
              isFixedDouble={isFixedDouble}
              adultsLabel={t('adults')}
              childrenLabel={t('children')}
              infantsLabel={t('infants')}
              adultsAgeText={adultsAgeText}
              childrenAgeText={childrenAgeText}
              infantsAgeText={infantsAgeText}
              controlsDisabled={isSingleSeatLeft}
            />

            {/* Room type */}
            <RoomTypeSection
              roomTypes={roomTypes}
              selectedRoomTypeId={selectedRoomTypeId}
              onChangeRoomTypeId={setSelectedRoomTypeId}
              disabled={noValidDepartures}
              label={t('roomType')}
              languageSuffix={languageSuffix}
            />

            {validationError && (
              <Text size="sm" color="red.500">
                {validationError}
              </Text>
            )}

            <Flex width="full" justify="space-between" align="center" pt={4} mt={4} borderTop="1px solid" borderColor="gray.100">
              <Text size="sm" color="gray.600">
                {t('total')}
              </Text>
              <Flex align="center" gap={2} sx={{
                  filter: isLoadingOfferPrice ? 'blur(10px)' : 'none',
                }}>
                <Text size="lg" fontWeight="bold" color="gray.800" >
                  {formatNumber(offerPrice?.price || groupTour.price)} ֏
                </Text>
          
              {offerPrice?.price != null && (
                <Flex align="center" sx={{
                  filter: isLoadingOfferPrice ? 'blur(10px)' : 'none',
                }}>
                  <Icon name="approximate" size="12" color="gray.600" />
                  <Text size="xs" color="gray.600">
                    {formatNumber(offerPrice?.priceInCurrency || groupTour.priceInCurrency)} {currencyLabel}
                  </Text>
                </Flex>
                )}  
              </Flex>
            </Flex>

            <Button
              mt={2}
              width="full"
              size="lg"
              isDisabled={!canProceed || noValidDepartures}
              onClick={handleBook}
            >
              {t('acceptAndContinue')}
            </Button>
          </VStack>
        </CardSectionLayout>
      </Box>
    </Box>
  )
}
