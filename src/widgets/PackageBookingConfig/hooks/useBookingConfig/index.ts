import { useEffect, useMemo, useState } from 'react'
import {
  type DictionaryTypes,
  type PackageEntity,
  useAvailableFlights,
  useCurrentOfferPackage,
  useDictionary,
  useGenerateOffers,
  useReturnFlights
} from '@entities/package'
import moment from 'moment/moment'
import { type DatePickerProps } from '@features/DatePickerFlights/ui/types.ts'
import { useSearchParams } from 'react-router-dom'
import { type SearchTravelersProps } from '@features/SearchTravelers/ui/types.ts'
import { type RoomsMenuProps } from '@features/RoomsMenu/ui/types.ts'

export const useBookingConfig = (defaultTourPackage: PackageEntity) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const roomId = useMemo(() => {
    const roomId = searchParams.get('roomId')

    return roomId ? parseInt(roomId, 10) : 0
  }, [searchParams])
  const [bookingData, setBookingData] = useState({
    fromDate: new Date(defaultTourPackage.destinationFlight.departureDate),
    toDate: new Date(defaultTourPackage.returnFlight.arrivalDate),
    departureFlightId: defaultTourPackage.destinationFlight.id,
    returnFlightId: defaultTourPackage.returnFlight.id,
    travelersData: {
      adultsCount: defaultTourPackage.adultTravelers,
      childrenCount:
        defaultTourPackage.childrenTravelers +
        defaultTourPackage.infantTravelers,
      childrenAges:
        searchParams
          .get('childrenAges')
          ?.split(',')
          .filter(Boolean)
          .map(Number) || []
    },
    hotelId: defaultTourPackage.hotel.id,
    lateCheckout: false,
    roomId
  })

  const updateBookingData = (
    data: Partial<typeof bookingData>,
    updateSearchParams: boolean = true
  ) => {
    setBookingData(prevState => {
      const updatedData = { ...prevState, ...data }

      if (!updateSearchParams) return updatedData

      setSearchParams({
        city: searchParams.get('city') || '0',
        adultsCount: String(updatedData.travelersData.adultsCount),
        childrenCount: String(updatedData.travelersData.childrenCount),
        childrenAges: updatedData.travelersData.childrenAges.join(','),
        hotelId: String(updatedData.hotelId),
        roomId: String(updatedData.roomId),
        departureFlightId: String(updatedData.departureFlightId),
        returnFlightId: String(updatedData.returnFlightId)
      })

      return updatedData
    })
  }

  // flight
  const { data: departureFlights } = useAvailableFlights({ city: 1 })
  const { data: returnFlights, isLoading: isLoadingReturnFlights } =
    useReturnFlights(
      {
        flightId: bookingData.departureFlightId
      },
      {
        enabled: !!bookingData.departureFlightId
      }
    )

  const availableDepartureDates = useMemo(() => {
    if (!departureFlights?.length) return []

    return departureFlights.map(flight => new Date(flight.departureDate))
  }, [JSON.stringify(departureFlights)])

  const availableReturnDates = useMemo(() => {
    if (!returnFlights?.length) return []

    return returnFlights.map(flight => new Date(flight.arrivalDate))
  }, [JSON.stringify(returnFlights)])

  const handleFromDateClick = (date: Date) => {
    const selectedFlight = departureFlights?.find(flight =>
      moment(flight.departureDate).isSame(date, 'day')
    )

    if (selectedFlight) {
      updateBookingData(
        {
          departureFlightId: selectedFlight.id
        },
        false
      )
    }
  }

  const handleFlightConfirm = (fromDate: Date, toDate?: Date | null) => {
    if (!fromDate || !toDate) return

    const returnFlight = returnFlights?.find(flight =>
      moment(flight.arrivalDate).isSame(toDate, 'day')
    )

    updateBookingData({
      fromDate,
      toDate,
      returnFlightId: returnFlight?.id
    })
  }

  // offers
  const { data: offers = [], isLoading: isLoadingOffers } = useGenerateOffers(
    {
      flightId: bookingData.departureFlightId,
      returnFlightId: bookingData.returnFlightId,
      adults: bookingData.travelersData.adultsCount,
      childs: bookingData.travelersData.childrenAges,
      hotelId: bookingData.hotelId,
      lateCheckout: bookingData.lateCheckout
    },
    {
      enabled: true
    }
  )

  // rooms
  const { data: roomTypes = [] } = useDictionary(
    'RoomTypeDictionary' as DictionaryTypes.RoomTypeDictionary
  )
  const roomOffers = useMemo(() => {
    if (!offers?.length) return []

    const offerRoomTypes = roomTypes.filter(roomType =>
      offers.some(offer => offer.roomType === roomType.key)
    )

    return offerRoomTypes
      .map(roomType => {
        const offer = offers.find(offer => offer.roomType === roomType.key)

        return {
          id: roomType.key,
          name: roomType.value,
          price: offer?.price || 0
        }
      })
      .sort((a, b) => a.price - b.price)
  }, [JSON.stringify(offers), JSON.stringify(roomTypes)])

  const isNotFound = useMemo(
    () => !isLoadingOffers && roomOffers.length === 0,
    [roomOffers?.length, isLoadingOffers]
  )

  const selectedRoomOffer = useMemo(
    () =>
      roomOffers.find(room => room.id === bookingData.roomId) || roomOffers[0],
    [JSON.stringify(roomOffers), bookingData.roomId]
  )

  const handleRoomSelect = (roomId: number) => {
    updateBookingData({
      roomId
    })
  }

  const selectedOffer = useMemo(
    () => offers.find(offer => offer.roomType === selectedRoomOffer.id),
    [selectedRoomOffer, JSON.stringify(offers)]
  )

  const {
    data: currentOfferPackage,
    refetch: refetchCurrentOfferPackage,
    isFetching: isFetchingCurrentOfferPackage
  } = useCurrentOfferPackage(selectedOffer?.offerId || 0, {
    enabled: !!selectedOffer?.offerId
  })

  useEffect(() => {
    selectedOffer?.offerId && refetchCurrentOfferPackage()
  }, [selectedOffer?.offerId, refetchCurrentOfferPackage])

  return {
    bookingData,
    selectedOffer,
    updateBookingData,
    isNotFound,
    flightsDatePickerProps: {
      fromDate: bookingData.fromDate,
      toDate: bookingData.toDate,
      onAccept: handleFlightConfirm,
      onFromDateClick: handleFromDateClick,
      availableDepartureDates,
      availableReturnDates,
      isLoadingReturnDates: isLoadingReturnFlights
    } as DatePickerProps,
    searchTravelersProps: {
      defaultData: bookingData.travelersData,
      onChange: travelersData => updateBookingData({ travelersData })
    } as SearchTravelersProps,
    currentOfferPackage,
    roomsMenuProps: {
      rooms: roomOffers,
      defaultRoom: selectedRoomOffer?.id,
      onChange: handleRoomSelect
    } as RoomsMenuProps,
    isLoadingTourPackage: isLoadingOffers || isFetchingCurrentOfferPackage
  }
}
