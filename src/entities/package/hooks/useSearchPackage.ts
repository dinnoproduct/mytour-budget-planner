import { type UseQueryOptions } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import { type PackageEntity, useSearch } from '@entities/package'
import { PACKAGE_REQUEST_REFETCH_INTERVAL } from '@shared/configs'
import { type EmptyObject } from 'react-hook-form'
import { useEffect, useMemo, useState } from 'react'

type Options = {
  onSuccess?: (packageDetails: PackageEntity | EmptyObject) => void
} & Omit<UseQueryOptions<PackageEntity[]>, 'queryKey' | 'queryFn'>

export const useSearchPackage = (options?: Options, isDataCached?: boolean) => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const [searchInput, setSearchInput] = useState<any>({})
  const childrenAgesParam = searchParams.get('childrenAges')
  const childrenAges = childrenAgesParam
    ? childrenAgesParam?.split(',').filter(Boolean).map(Number) || []
    : []
  const {
    data: packages = [],
    isLoading,
    isFetched
  } = useSearch(searchInput, {
    refetchInterval: PACKAGE_REQUEST_REFETCH_INTERVAL,
    enabled: !!searchInput.cities?.length && !isDataCached,
    ...options
  })

  useEffect(() => {
    if (!isLoading) {
      const childrenAges = searchParams.get('childrenAges')
      const children = childrenAges
        ? childrenAges?.split(',').filter(Boolean).map(Number) || []
        : []

      setSearchInput({
        cities: [parseInt(searchParams.get('city') || '0', 10)].filter(id => id > 0),
        adults: parseInt(searchParams.get('adultsCount') || '0', 10),
        childs: children,
        dateFrom: searchParams.get('from'),
        dateTo: searchParams.get('to')
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, JSON.stringify(searchParams)])

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
    isFetched,
    childrenAges
  }
}
