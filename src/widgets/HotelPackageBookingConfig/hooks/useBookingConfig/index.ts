import { useEffect, useMemo, useState } from 'react'
import {
  type DictionaryTypes,
  type PackageEntity,
  useCurrentHotelPackageOffer,
  useDictionary,
  useGenerateHotelOffers
} from '@entities/package'
import { type DatePickerProps } from '@features/DatePicker/ui/types.ts'
import { useSearchParams } from 'react-router-dom'
import { type SearchTravelersProps } from '@features/SearchTravelers/ui/types.ts'
import { type RoomsMenuProps } from '@features/RoomsMenu/ui/types.ts'
import moment from 'moment'

export const useBookingConfig = (defaultTourPackage: PackageEntity) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const roomId = useMemo(() => {
    const roomId = searchParams.get('roomId')

    return roomId ? parseInt(roomId, 10) : 0
  }, [searchParams])

  const [bookingData, setBookingData] = useState({
    checkIn: new Date(defaultTourPackage.checkin),
    checkOut: new Date(defaultTourPackage.checkout),
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
    roomId
  })

  const updateBookingData = (data: Partial<typeof bookingData>) => {
    setBookingData(prevState => {
      const updatedData = { ...prevState, ...data }

      setSearchParams({
        city: searchParams.get('city') || '0',
        adultsCount: String(updatedData.travelersData.adultsCount),
        childrenCount: String(updatedData.travelersData.childrenCount),
        childrenAges: updatedData.travelersData.childrenAges.join(','),
        hotelId: String(updatedData.hotelId),
        roomId: String(updatedData.roomId),
        from: moment(updatedData.checkIn).format('YYYY-MM-DD'),
        to: moment(updatedData.checkOut).format('YYYY-MM-DD')
      })

      return updatedData
    })
  }

  // flight
  const handleFlightConfirm = (fromDate: Date, toDate?: Date | null) => {
    if (!fromDate || !toDate) return

    updateBookingData({
      checkIn: fromDate,
      checkOut: toDate
    })
  }

  // offers
  const { data: offers = [], isLoading: isLoadingOffers } =
    useGenerateHotelOffers(
      {
        checkin: bookingData.checkIn.toDateString(),
        checkout: bookingData.checkOut.toDateString(),
        adults: bookingData.travelersData.adultsCount,
        childs: bookingData.travelersData.childrenAges,
        hotelId: bookingData.hotelId
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
  } = useCurrentHotelPackageOffer(selectedOffer?.offerId || 0, {
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
      fromDate: bookingData.checkIn,
      toDate: bookingData.checkOut,
      onAccept: handleFlightConfirm
    } as DatePickerProps,
    searchTravelersProps: {
      defaultData: bookingData.travelersData,
      onChange: travelersData => updateBookingData({ travelersData })
    } as SearchTravelersProps,
    roomsMenuProps: {
      rooms: roomOffers,
      defaultRoom: selectedRoomOffer?.id,
      onChange: handleRoomSelect
    } as RoomsMenuProps,
    currentOfferPackage,
    isLoadingTourPackage: isLoadingOffers || isFetchingCurrentOfferPackage
  }
}
