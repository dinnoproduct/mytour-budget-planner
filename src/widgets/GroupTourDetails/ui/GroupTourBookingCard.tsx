import { Box, Flex, FormControl, FormLabel, Select, VStack } from '@chakra-ui/react'
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

const MAX_INFANTS = 2

type GroupTourBookingCardProps = {
  groupTour: GroupTourInfo
  containerRef?: React.RefObject<HTMLDivElement | null>
}

function TravelerStepper({
  value,
  min = 0,
  max = 9,
  onChange,
  label,
}: {
  value: number
  min?: number
  max?: number
  onChange: (n: number) => void
  label: string
}) {
  const clamped = Math.max(min, Math.min(max, value))
  return (
    <Flex align="center" justify="space-between" width="full">
      <Text size="sm" color="gray.700">
        {label}
      </Text>
      <Flex align="center" gap={2}>
        <Button
          size="sm"
          variant="outline-blue"
          isDisabled={clamped <= min}
          onClick={() => onChange(clamped - 1)}
          aria-label="decrease"
        >
          <Icon name="remove" size="16" />
        </Button>
        <Text size="sm" fontWeight="medium" minW="24px" textAlign="center">
          {clamped}
        </Text>
        <Button
          size="sm"
          variant="outline-blue"
          isDisabled={clamped >= max}
          onClick={() => onChange(clamped + 1)}
          aria-label="increase"
        >
          <Icon name="add" size="16" />
        </Button>
      </Flex>
    </Flex>
  )
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

  const infantsAllowed = groupTour.infantsAllowed !== false
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
          <VStack align="stretch" spacing={4}>
            {/* Departure */}
            <FormControl isInvalid={!noValidDepartures && !selectedDeparture && validDepartures.length > 0}>
              <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                {t('groupTour.dates')}
              </FormLabel>
              {noValidDepartures ? (
                <Text size="sm" color="red.500">
                  {t('noAvailableDepartures')}
                </Text>
              ) : (
                <Select
                  value={selectedDepartureIndex}
                  onChange={(e) => setSelectedDepartureIndex(Number(e.target.value))}
                  isDisabled={noValidDepartures}
                  size="sm"
                >
                  {validDepartures.map((d, i) => (
                    <option key={`${d.startDate}-${i}`} value={i}>
                      {formatDate(d.startDate)} · {t('availableSeats', { count: d.availableSeats })}
                    </option>
                  ))}
                </Select>
              )}
            </FormControl>

            {/* Room type */}
            {roomTypes.length > 0 && (
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                  {t('roomType')}
                </FormLabel>
                <Select
                  value={selectedRoomTypeId}
                  onChange={(e) => setSelectedRoomTypeId(e.target.value ? Number(e.target.value) : '')}
                  isDisabled={noValidDepartures}
                  size="sm"
                >
                  {roomTypes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {getLocalized(r.name, languageSuffix) || t('groupTour.selectRoomType')}
                    </option>
                  ))}
                </Select>
              </FormControl>
            )}

            {/* Travelers */}
            <VStack align="stretch" spacing={2}>
              <TravelerStepper
                value={adults}
                min={adultMin}
                max={adultMax}
                onChange={(n) => {
                  const v = Math.max(adultMin, Math.min(adultMax, n))
                  setAdults(v)
                  if (isDouble) setChildren(2 - v)
                }}
                label={t('adults')}
              />
              {showChildSelector && (
                <TravelerStepper
                  value={children}
                  min={childMin}
                  max={childMax}
                  onChange={(n) => {
                    const v = Math.max(childMin, Math.min(childMax, n))
                    setChildren(v)
                    if (isDouble) setAdults(2 - v)
                  }}
                  label={t('children')}
                />
              )}
              {showInfantSelector && (
                <TravelerStepper
                  value={infants}
                  min={0}
                  max={infantMax}
                  onChange={(n) => setInfants(Math.max(0, Math.min(infantMax, n)))}
                  label={t('infants')}
                />
              )}
            </VStack>

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
              {t('groupTour.book')}
            </Button>
          </VStack>
        </CardSectionLayout>
      </Box>
    </Box>
  )
}
