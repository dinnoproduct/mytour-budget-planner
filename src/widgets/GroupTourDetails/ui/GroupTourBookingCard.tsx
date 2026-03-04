import { Box, Flex, VStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useMemo, useState, useEffect } from 'react'
import { Button, Icon, Text } from '@ui'
import { CardSectionLayout } from '@/shared/ui/layout/CardSectionLayout'
import { useBreakpoint } from '@shared/hooks'
import type { GroupTourInfo, GroupTourDeparture } from '@entities/package'
import { LANGUAGE_PREFIX, type LanguageName } from '@shared/model'
import { numberWithCommaNormalizer } from '@/utils/normalizers'
import {
  getValidDepartures,
  getLocalized,
  getRoomTypeKind,
  formatDate,
  type RoomTypeKind,
} from '../lib/utils'
import { SectionTitle } from './GroupTourBookingCard/SectionTitle'
import { TravelersSection } from './GroupTourBookingCard/TravelersSection'
import { RoomTypeSection } from './GroupTourBookingCard/RoomTypeSection'
import { DatesSection } from './GroupTourBookingCard/DatesSection'

const MAX_INFANTS = 2

type GroupTourBookingCardProps = {
  groupTour: GroupTourInfo
  containerRef?: React.RefObject<HTMLDivElement | null>
}

export const GroupTourBookingCard = ({ groupTour, containerRef }: GroupTourBookingCardProps) => {
  const { t, i18n } = useTranslation()
  const { isMd } = useBreakpoint()
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

  const infantsAllowed = groupTour.travelers?.infant > 0
  const roomTypes = groupTour.roomTypes ?? []

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
  const roomKind: RoomTypeKind = selectedRoom
    ? getRoomTypeKind(selectedRoom, languageSuffix)
    : 'other'

  const isSingle = roomKind === 'single'
  const isDouble = roomKind === 'double'

  useEffect(() => {
    if (isSingle) {
      setAdults(1)
      setChildren(0)
    }
  }, [isSingle])

  useEffect(() => {
    if (isDouble && adults + children !== 2) {
      if (adults < 1) {
        setAdults(1)
        setChildren(1)
      } else {
        setChildren(Math.max(0, 2 - adults))
      }
    }
  }, [isDouble, adults, children])

  const showChildSelector = !isSingle
  const showInfantSelector = infantsAllowed

  const adultMin = 1
  const adultMax = isSingle ? 1 : isDouble ? 2 : 9
  const childMin = 0
  const childMax = isSingle ? 0 : isDouble ? 1 : 9
  const infantMax = infantsAllowed ? MAX_INFANTS : 0

  const validationError = useMemo((): string | null => {
    if (noValidDepartures) return null
    if (validDepartures.length > 0 && selectedDepartureIndex < 0) return t('groupTour.validation.selectDeparture')
    if (adults < 0 || children < 0 || infants < 0) return t('groupTour.validation.invalidTravelers')
    if (isSingle && (adults !== 1 || children !== 0)) return t('groupTour.validation.invalidTravelers')
    if (isDouble && adults + children !== 2) return t('groupTour.validation.invalidTravelers')
    if ((roomKind === 'twin' || roomKind === 'triple') && adults < 1) return t('groupTour.validation.invalidTravelers')
    if (infants > infantMax) return t('groupTour.validation.invalidTravelers')
    return null
  }, [
    noValidDepartures,
    validDepartures.length,
    selectedDepartureIndex,
    adults,
    children,
    infants,
    isSingle,
    isDouble,
    roomKind,
    infantMax,
    t,
  ])

  const selectedDeparture: GroupTourDeparture | null =
    validDepartures[selectedDepartureIndex] ?? null
  const canProceed =
    !noValidDepartures && selectedDeparture !== null && validationError === null

  const handleBook = () => {
    if (!canProceed) return
    // TODO: wire to booking flow
  }

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
        top={isFixed ? '100px' : 'auto'}
      >
        <CardSectionLayout
          px="4"
          py="4"
          gridArea="totalPrice"
          position={{
            base: 'fixed',
            md: 'static',
          }}
          bottom="0"
          left="0"
          right="0"
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
              showInfantSelector={showInfantSelector}
              isDouble={isDouble}
              adultsLabel={t('adults')}
              childrenLabel={t('children')}
              infantsLabel={t('infants')}
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

            <Flex width="full" justify="space-between" align="center" pt={2}>
              <Text size="sm" color="gray.600">
                {t('startFrom')}
              </Text>
              <Text size="lg" fontWeight="bold" color="gray.800">
                {numberWithCommaNormalizer(groupTour.price)} {groupTour.currency}
              </Text>
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
