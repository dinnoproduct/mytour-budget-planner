import { type UseQueryOptions } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import { type PackageEntity, useSearchHotelPackages } from '@entities/package'
import { PACKAGE_REQUEST_REFETCH_INTERVAL } from '@shared/configs'
import { type EmptyObject } from 'react-hook-form'
import { useEffect, useMemo, useState } from 'react'
import moment from 'moment'

type Options = {
  onSuccess?: (packageDetails: PackageEntity | EmptyObject) => void
} & Omit<UseQueryOptions<PackageEntity[]>, 'queryKey' | 'queryFn'>

export const useSearchHotelPackage = (options?: Options) => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const [searchInput, setSearchInput] = useState<any>({})

  const {
    data: packages = [],
    isLoading,
    isFetched
  } = useSearchHotelPackages(searchInput, {
    refetchInterval: PACKAGE_REQUEST_REFETCH_INTERVAL,
    enabled: !!searchInput.dateFrom,
    ...options
  })
  console.log('isLoading', isLoading)

  const getDateFromParam = (param: string | null) =>
    param ? moment(param).format() : null

  useEffect(() => {
    if (!isFetched) {
      const dateFrom = moment(
        getDateFromParam(searchParams.get('from')) as string
      )
        .set({ hour: 14 })
        .format()

      const dateTo = moment(getDateFromParam(searchParams.get('to')) as string)
        .set({ hour: 12 })
        .format()

      const childrenAges = searchParams.get('childrenAges')
      const children = childrenAges
        ? childrenAges?.split(',').filter(Boolean).map(Number) || []
        : []

      setSearchInput({
        dateFrom,
        dateTo,
        cities: [parseInt(searchParams.get('city') || '0', 10)],
        adults: parseInt(searchParams.get('adultsCount') || '0', 10),
        childs: children
      })
    }
  }, [searchParams, isFetched])

  const hotelId = useMemo(
    () => parseInt(searchParams.get('hotelId') || '0', 10),
    [searchParams]
  )

  const packageDetails: PackageEntity | null = useMemo(
    () => packages?.find(pkg => pkg.hotel.id === hotelId) || null,
    [packages, hotelId]
  )

  useEffect(() => {
    if (options?.onSuccess && packageDetails?.offerId) {
      options.onSuccess(packageDetails)
    }
  }, [packageDetails, options])

  return {
    packageDetails,
    isLoading,
    isFetched
  }
}
