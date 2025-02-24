import {
  type PackageEntity,
  useGenerateOffers,
  usePackageByOfferId
} from '@entities/package'
import { useEffect, useMemo } from 'react'
import { PACKAGE_REQUEST_REFETCH_INTERVAL } from '@shared/configs'
import { type EmptyObject } from 'global'

export const useSearchOfferPackage = (
  searchData: SearchData,
  options?: Options
) => {
  const { data: offers, isLoading: isLoadingGenerateOffers } =
    useGenerateOffers(
      {
        flightId: searchData.flightId,
        returnFlightId: searchData.returnFlightId,
        adults: searchData.adultsCount,
        childs: searchData.childrenAges,
        lateCheckout: searchData.lateCheckout || false,
        hotelId: searchData?.hotelId
      },
      {
        refetchInterval: PACKAGE_REQUEST_REFETCH_INTERVAL,
        enabled: typeof options?.enabled === 'boolean' ? options.enabled : true
      }
    )
  console.log('offers', offers)

  const offerId = useMemo(() => {
    const roomId = searchData?.roomId

    return offers?.find(offer => offer.roomType === roomId)?.offerId || 0
  }, [offers, searchData?.roomId])

  console.log('offerId', offerId)
  const { data: packageDetails, isLoading: isLoadingPackage } =
    usePackageByOfferId(offerId, {
      enabled: !!offerId
    })

  useEffect(() => {
    if (packageDetails?.offerId) {
      options?.onSuccess && options?.onSuccess(packageDetails)
    }
  }, [packageDetails?.offerId, options])

  return {
    packageDetails,
    isLoading: isLoadingGenerateOffers || isLoadingPackage
  }
}

type SearchData = {
  flightId: number
  returnFlightId: number
  adultsCount: number
  childrenAges: number[]
  hotelId: number
  roomId: number
  lateCheckout?: boolean
}

type Options = {
  enabled?: boolean
  onSuccess: (packageDetails: PackageEntity | EmptyObject) => void
}
