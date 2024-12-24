import { type UseQueryOptions } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import { type PackageEntity, useSearchHotelPackages } from '@entities/package'
import { PACKAGE_REQUEST_REFETCH_INTERVAL } from '@shared/configs'
import { type EmptyObject } from 'react-hook-form'
import { useEffect, useMemo } from 'react'
import moment from 'moment'

type PassedSearchData = {
  from: string
  to: string
  city: number
  adultsCount: number
  childrenAges: number[]
  hotelId: number
  roomId: number
}

type Options = {
  onSuccess?: (packageDetails: PackageEntity | EmptyObject) => void
} & Omit<UseQueryOptions<PackageEntity[]>, 'queryKey' | 'queryFn'>

export const useSearchHotelPackage = (
  options?: Options,
  passedSearchData?: PassedSearchData
) => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)

  const getDateFromParam = (param: string | null) =>
    param ? moment(param).format() : null

  const searchData = useMemo(() => {
    if (passedSearchData) {
      return {
        dateFrom: passedSearchData.from,
        dateTo: passedSearchData.to,
        cities: [passedSearchData.city],
        adults: passedSearchData.adultsCount,
        childs: passedSearchData.childrenAges
      }
    }

    return {
      dateFrom: getDateFromParam(searchParams.get('from')) as string,
      dateTo: getDateFromParam(searchParams.get('to')) as string,
      cities: [parseInt(searchParams.get('city') || '0', 10)],
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

  searchData.dateFrom = moment(searchData.dateFrom).set({ hour: 14 }).format()
  searchData.dateTo = moment(searchData.dateTo).set({ hour: 12 }).format()

  const { data: packages, isLoading } = useSearchHotelPackages(searchData, {
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
    () => packages?.find(pkg => pkg.hotel.id === hotelId) || null,
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
