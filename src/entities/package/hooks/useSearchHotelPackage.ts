import { type UseQueryOptions } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import {
  type PackageEntity,
  useGenerateHotelOffers,
  useHotelPackageByOfferId
} from '@entities/package'
import { type EmptyObject } from 'react-hook-form'
import { useEffect, useMemo } from 'react'
import moment from 'moment'

type Options = {
  onSuccess?: (packageDetails: PackageEntity | EmptyObject) => void
} & Omit<UseQueryOptions<PackageEntity>, 'queryKey' | 'queryFn' | 'onSuccess'>

export const useSearchHotelPackage = (options?: Options) => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)

  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const adultsCount = parseInt(searchParams.get('adultsCount') || '0', 10)
  const childrenAgesParam = searchParams.get('childrenAges')
  const childrenAges = childrenAgesParam
    ? childrenAgesParam?.split(',').filter(Boolean).map(Number) || []
    : []
  const hotelId = parseInt(searchParams.get('hotelId') || '0', 10)
  const roomId = parseInt(searchParams.get('roomId') || '0', 10)
  const mealId = parseInt(searchParams.get('mealId') || '0', 10)
  const travelAgency = parseInt(searchParams.get('travelAgency') || '0', 10)

  const checkin = useMemo(
    () =>
      from ? moment(from).set({ hour: 14 }).format('ddd MMM DD YYYY') : '',
    [from]
  )
  const checkout = useMemo(
    () => (to ? moment(to).set({ hour: 12 }).format('ddd MMM DD YYYY') : ''),
    [to]
  )

  const { data: offers = [], isLoading: isLoadingGenerateOffers } =
    useGenerateHotelOffers(
      {
        checkin,
        checkout,
        adults: adultsCount,
        childs: childrenAges,
        hotelId
      },
      {
        enabled: !!(checkin && checkout && hotelId)
      }
    )

  const offerId = useMemo(() => {
    if (!offers?.length) {
      return 0
    }

    if (mealId && roomId) {
      return (
        offers.find(
          offer => offer.roomType === roomId && offer.foodType === mealId
        )?.offerId || 0
      )
    }

    if (roomId) {
      return offers.find(offer => offer.roomType === roomId)?.offerId || 0
    }

    return offers[0].offerId || 0
  }, [offers, roomId, mealId])

  const {
    data: packageDetails,
    isLoading: isLoadingHotelPackage,
    isFetched
  } = useHotelPackageByOfferId(
    {
      offerId,
      travelAgency
    },
    {
      enabled: !!offerId && !!travelAgency,
      ...options
    }
  )

  useEffect(() => {
    if (options?.onSuccess && packageDetails?.offerId) {
      options.onSuccess(packageDetails)
    }
  }, [packageDetails, options])

  return {
    packageDetails,
    isLoading: isLoadingGenerateOffers || isLoadingHotelPackage,
    isFetched
  }
}
