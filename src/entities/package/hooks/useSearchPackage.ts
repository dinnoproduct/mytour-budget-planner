import { type UseQueryOptions } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import { type PackageEntity, useSearchPackages } from '@entities/package'
import { PACKAGE_REQUEST_REFETCH_INTERVAL } from '@shared/configs'
import { type EmptyObject } from 'react-hook-form'

type PassedSearchData = {
  flightId: number
  returnFlightId: number
  city: number
  adults: number
  childs: number[]
  hotelId: number
  roomId: number
}

export const useSearchPackage = (
  options?: Omit<UseQueryOptions<PackageEntity[]>, 'queryKey' | 'queryFn'>,
  passedSearchData?: PassedSearchData
) => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)

  const searchData = {
    flightId:
      passedSearchData?.flightId ||
      parseInt(searchParams.get('departureFlightId') || '0', 10),
    returnFlightId:
      passedSearchData?.returnFlightId ||
      parseInt(searchParams.get('returnFlightId') || '0', 10),
    city:
      passedSearchData?.city || parseInt(searchParams.get('city') || '0', 10),
    adults:
      passedSearchData?.adults ||
      parseInt(searchParams.get('adultsCount') || '0', 10),
    childs:
      passedSearchData?.childs || searchParams.get('childrenAges')
        ? searchParams
          .get('childrenAges')
            ?.split(',')
          .filter(Boolean)
          .map(Number) || []
        : []
  }

  const { data: packages, isLoading } = useSearchPackages(searchData, {
    refetchInterval: PACKAGE_REQUEST_REFETCH_INTERVAL,
    ...options
  })

  const hotelId =
    passedSearchData?.hotelId ||
    parseInt(searchParams.get('hotelId') || '0', 10)
  const roomId =
    passedSearchData?.roomId || parseInt(searchParams.get('roomId') || '0', 10)

  const packageDetails: PackageEntity | EmptyObject =
    packages?.find(
      pkg => pkg.hotel.id === hotelId && pkg.roomType === roomId
    ) || {}

  return {
    packageDetails,
    isLoading
  }
}
