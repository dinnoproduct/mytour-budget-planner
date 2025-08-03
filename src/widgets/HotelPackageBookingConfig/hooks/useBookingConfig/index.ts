import { useEffect, useMemo, useState } from 'react'
import {
  type DictionaryTypes,
  type OfferEntity,
  type PackageEntity,
  useCalculatePrepayment,
  useCurrentHotelPackageOffer,
  useDictionary,
  useGenerateHotelOffers
} from '@entities/package'
import { type DatePickerProps } from '@features/DatePicker/ui/types.ts'
import { useSearchParams } from 'react-router-dom'
import { type SearchTravelersProps } from '@features/SearchTravelers/ui/types.ts'
import moment from 'moment'

export const useBookingConfig = (defaultTourPackage: PackageEntity) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const roomId = useMemo(() => {
    const roomId = searchParams.get('roomId')

    return roomId ? parseInt(roomId, 10) : 0
  }, [searchParams])

  const mealId = useMemo(() => {
    const mealId = searchParams.get('mealId')

    return mealId ? parseInt(mealId, 10) : -1
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
    roomId,
    mealId
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
        to: moment(updatedData.checkOut).format('YYYY-MM-DD'),
        mealId: String(updatedData.mealId),
        travelAgency: String(defaultTourPackage.travelAgency.id)
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
        hotelId: bookingData.hotelId,
        travelAgency: defaultTourPackage.travelAgency.id
      },
    )

  // rooms
  const { data: roomTypes = [] } = useDictionary(
    'RoomTypeDictionary' as DictionaryTypes.RoomTypeDictionary
  )
  const { data: foodTypes = [] } = useDictionary(
    'FoodTypeDictionary' as DictionaryTypes.FoodTypeDictionary
  )

  const roomOffers = useMemo(() => {
    if (!offers?.length) return []

    // Group offers by room type
    const offersByRoomType = offers.reduce(
      (acc, offer: OfferEntity) => {
        if (!acc[offer.roomType]) {
          acc[offer.roomType] = []
        }

        acc[offer.roomType].push(offer)

        return acc
      },
      {} as Record<number, OfferEntity[]>
    )

    return Object.entries(offersByRoomType)
      .map(([roomTypeKey, roomOffers]): any => {
        const roomType = parseInt(roomTypeKey, 10)
        const firstOffer = roomOffers[0]
        const roomTypeInfo = roomTypes.find(type => type.key === roomType)

        return {
          id: roomType,
          name: roomTypeInfo?.value || '',
          nights: firstOffer?.nights || 0,
          checkInDate: new Date(firstOffer?.checkin || bookingData.checkIn),
          checkOutDate: new Date(firstOffer?.checkout || bookingData.checkOut),
          price: firstOffer?.price || 0,
          meals: roomOffers.map(offer => {
            const foodTypeInfo = foodTypes.find(
              type => type.key === offer.foodType
            )

            return {
              mealType: offer.foodType,
              mealName: foodTypeInfo?.value || '',
              offerId: offer.offerId,
              price: offer.price,
              priceInCurrency: offer.priceInCurrency,
              currency: offer.currency
            }
          })
        }
      })
      .sort((a, b) => a.price - b.price)
  }, [JSON.stringify(offers), JSON.stringify(roomTypes), bookingData.roomId])

  const isNotFound = useMemo(
    () => !isLoadingOffers && roomOffers.length === 0,
    [roomOffers?.length, isLoadingOffers]
  )

  const handleRoomSelect = (roomId: number, mealId: number) => {
    updateBookingData({
      roomId,
      mealId
    })
  }

  const selectedOffer = useMemo(() => {
    if (offers.length === 0) return null
    const mealOffer =
      bookingData.mealId >= 0
        ? offers.find(
          offer =>
            offer.foodType === bookingData.mealId &&
              offer.roomType === bookingData.roomId
        )
        : offers.filter(offer => offer.roomType === bookingData.roomId)[0]

    return mealOffer
  }, [bookingData.mealId, bookingData.roomId, JSON.stringify(offers)])

  const {
    data: currentOfferPackage,
    refetch: refetchCurrentOfferPackage,
    isFetching: isFetchingCurrentOfferPackage
  } = useCurrentHotelPackageOffer(
    {
      offerId: selectedOffer?.offerId || 0,
      travelAgency: defaultTourPackage.travelAgency.id
    },
    {
      enabled: !!selectedOffer?.offerId && !!defaultTourPackage.travelAgency.id
    }
  )

  useEffect(() => {
    selectedOffer?.offerId && refetchCurrentOfferPackage()
  }, [selectedOffer?.offerId, refetchCurrentOfferPackage])

  // calculate prepayment
  const { data: prepaymentInfo = null, isPending: isCalculatingPrepayment } =
    useCalculatePrepayment(
      {
        travelAgencyId: defaultTourPackage.travelAgency.id,
        bookingType: 2,
        destinationId: defaultTourPackage.city.id,
        startDate: selectedOffer?.checkin || '',
        fullPrice: selectedOffer?.price || 0,
        calculationSource: 'search'
      },
      { enabled: !!selectedOffer && !!selectedOffer?.checkin }
    )

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
      defaultRoomId: bookingData.roomId,
      defaultMealId: bookingData.mealId,
      onChange: handleRoomSelect
    },
    currentOfferPackage,
    isLoadingTourPackage: isLoadingOffers || isFetchingCurrentOfferPackage,
    prepaymentInfo,
    isCalculatingPrepayment
  }
}
