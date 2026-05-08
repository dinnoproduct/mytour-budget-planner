import {
  type PackageEntity,
  useGenerateHotelOffers,
  useHotelPackageByOfferId
} from '@entities/package'
import { type EmptyObject } from 'react-hook-form'
import { useEffect, useMemo } from 'react'
import moment from 'moment'

export const useSearchHotelOfferPackage = (
  searchData: SearchData,
  options?: Options
) => {
  const checkinMoment = useMemo(
    () => moment(searchData.from, moment.ISO_8601, true),
    [searchData.from]
  )
  const checkoutMoment = useMemo(
    () => moment(searchData.to, moment.ISO_8601, true),
    [searchData.to]
  )
  const hasValidDates = checkinMoment.isValid() && checkoutMoment.isValid()

  const { data: offers = [], isLoading: isLoadingGenerateOffers } =
    useGenerateHotelOffers(
      {
        checkin: hasValidDates
          ? checkinMoment.clone().set({ hour: 14 }).format()
          : '',
        checkout: hasValidDates
          ? checkoutMoment.clone().set({ hour: 12 }).format()
          : '',
        adults: searchData.adultsCount,
        childs: searchData.childrenAges,
        hotelId: searchData.hotelId,
        travelAgency: searchData.travelAgency
      },
      {
        enabled:
          hasValidDates &&
          (typeof options?.enabled === 'boolean' ? options.enabled : true)
      }
    )

  const offerId = useMemo(() => {
    const roomId = searchData.roomId
    const mealId = searchData.mealId

    return (
      offers?.find(
        offer => offer.roomType === roomId && offer.foodType === mealId
      )?.offerId || 0
    )
  }, [offers, searchData?.roomId, searchData?.mealId])

  const { data: hotelPackageDetails, isLoading: isLoadingHotelPackage } =
    useHotelPackageByOfferId(
      {
        offerId,
        travelAgency: searchData.travelAgency
      },
      {
        enabled: !!offerId && !!searchData.travelAgency
      }
    )

  useEffect(() => {
    if (hotelPackageDetails?.offerId) {
      options?.onSuccess && options?.onSuccess(hotelPackageDetails)
    }
  }, [hotelPackageDetails?.offerId, options])

  return {
    packageDetails: hotelPackageDetails,
    isLoading: isLoadingGenerateOffers || isLoadingHotelPackage
  }
}

type SearchData = {
  from: string
  to: string
  adultsCount: number
  childrenAges: number[]
  hotelId: number
  roomId: number
  mealId: number
  travelAgency: number
}

type Options = {
  enabled?: boolean
  onSuccess: (packageDetails: PackageEntity | EmptyObject) => void
}
