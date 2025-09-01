import { useEffect, useMemo, useState } from 'react'
import {
  type PackageEntity,
  useCalculatePrepayment,
  useCurrentHotelPackageOffer,
} from '@entities/package'
import { type DatePickerProps } from '@features/DatePicker/ui/types.ts'
import { useSearchParams } from 'react-router-dom'
import { type SearchTravelersProps } from '@features/SearchTravelers/ui/types.ts'
import moment from 'moment'
import { generatedMultivendorOffersAtom } from '@/modules/packages/store/store'
import { useRecoilState } from 'recoil'

export const useBookingConfig = (defaultTourPackage: PackageEntity, offerId?: number) => {
  const [generatedMultivendorOffers] =
  useRecoilState(generatedMultivendorOffersAtom);

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

  const handleRoomSelect = (roomId: number, mealId: number) => {
    updateBookingData({
      roomId,
      mealId
    })
  }

  const {
    data: currentOfferPackage,
    refetch: refetchCurrentOfferPackage,
    isFetching: isFetchingCurrentOfferPackage
  } = useCurrentHotelPackageOffer(
    {
      offerId: offerId || 0,
      travelAgency: defaultTourPackage.travelAgency.id
    },
    {
      enabled: !!offerId && !!defaultTourPackage.travelAgency.id
    }
  )

  const isNotFound = useMemo(
    () => !isFetchingCurrentOfferPackage && currentOfferPackage === null,
    [currentOfferPackage, isFetchingCurrentOfferPackage]
  )

  useEffect(() => {
    offerId && refetchCurrentOfferPackage()
  }, [offerId, refetchCurrentOfferPackage])

  // calculate prepayment
  const { data: prepaymentInfo = null, ...rest } =
    useCalculatePrepayment(
      {
        travelAgencyId: defaultTourPackage.travelAgency.id,
        bookingType: 2,
        destinationId: defaultTourPackage.city.id,
        startDate: currentOfferPackage?.checkin || '',
        fullPrice: currentOfferPackage?.price || 0,
        calculationSource: 'search'
      },
      { enabled: !!currentOfferPackage && !!currentOfferPackage?.checkin }
    )

  const isCalculatingPrepayment = useMemo(() => {
    return rest.isPending || rest.isRefetching
  }, [rest.isPending, rest.isRefetching])

  return {
    bookingData,
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
      defaultRoomId: bookingData.roomId,
      defaultMealId: bookingData.mealId,
      onChange: handleRoomSelect
    },
    currentOfferPackage,
    isLoadingTourPackage: isFetchingCurrentOfferPackage,
    prepaymentInfo,
    isCalculatingPrepayment
  }
}
