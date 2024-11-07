import { type UseQueryOptions } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import { type PackageEntity, useSearchPackages } from '@entities/package'
import { PACKAGE_REQUEST_REFETCH_INTERVAL } from '@shared/configs'
import { type EmptyObject } from 'react-hook-form'
import { useEffect, useMemo } from 'react'

type PassedSearchData = {
  flightId: number
  returnFlightId: number
  city: number
  adultsCount: number
  childrenAges: number[]
  hotelId: number
  roomId: number
}

type Options = {
  onSuccess?: (packageDetails: PackageEntity | EmptyObject) => void
} & Omit<UseQueryOptions<PackageEntity[]>, 'queryKey' | 'queryFn'>

export const useSearchPackage = (
  options?: Options,
  passedSearchData?: PassedSearchData
) => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)

  const searchData = useMemo(() => {
    if (passedSearchData) {
      return {
        flightId: passedSearchData.flightId,
        returnFlightId: passedSearchData.returnFlightId,
        city: passedSearchData.city,
        adults: passedSearchData.adultsCount,
        childs: passedSearchData.childrenAges
      }
    }

    return {
      flightId: parseInt(searchParams.get('departureFlightId') || '0', 10),
      returnFlightId: parseInt(searchParams.get('returnFlightId') || '0', 10),
      city: parseInt(searchParams.get('city') || '0', 10),
      adults: parseInt(searchParams.get('adultsCount') || '0', 10),
      childs: searchParams.get('childrenAges')
        ? searchParams
          .get('childrenAges')
          ?.split(',')
          .filter(Boolean)
          .map(Number) || []
        : []
    }
  }, [passedSearchData, searchParams])

  const { data: packages, isLoading } = useSearchPackages(searchData, {
    refetchInterval: PACKAGE_REQUEST_REFETCH_INTERVAL,
    ...options
  })

  const hotelId = useMemo(
    () =>
      passedSearchData?.hotelId ||
      parseInt(searchParams.get('hotelId') || '0', 10),
    [passedSearchData?.hotelId, searchParams]
  )
  const roomId = useMemo(
    () =>
      passedSearchData?.roomId ||
      parseInt(searchParams.get('roomId') || '0', 10),
    [passedSearchData?.roomId, searchParams]
  )

  const packageDetails: PackageEntity | null = useMemo(
    () =>
      packages?.find(
        pkg => pkg.hotel.id === hotelId && pkg.roomType === roomId
      ) || null,
    [packages, hotelId, roomId]
  )

  useEffect(() => {
    if (options?.onSuccess && packageDetails?.offerId) {
      options.onSuccess(packageDetails)
    }
  }, [packageDetails, options])

  return {
    packageDetails,
    isLoading
  }
}
