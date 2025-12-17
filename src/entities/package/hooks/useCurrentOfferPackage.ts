import {
  useQuery,
  useQueryClient,
  type UseQueryOptions
} from '@tanstack/react-query'
import { type PackageEntity, packageUseCases } from '@entities/package'
import { PACKAGE_REQUEST_REFETCH_INTERVAL } from '@shared/configs'
import { useEffect, useState } from 'react'

const QUERY_KEY = 'current-offer-package'

export const useCurrentOfferPackage = (
  offerId: number,
  travelAgency: number,
  options?: Omit<UseQueryOptions<PackageEntity>, 'queryFn' | 'queryKey'>
) =>
  useQuery({
    ...(options || {}),
    refetchInterval: PACKAGE_REQUEST_REFETCH_INTERVAL,
    queryFn: () => packageUseCases.getPackage(offerId, travelAgency),
    queryKey: [QUERY_KEY]
  })

export const useGetCurrentOfferPackage = () => {
  const queryClient = useQueryClient()

  return queryClient.getQueryData<PackageEntity>(['current-offer-package'])
}

export const useCurrentPackageOfferValue = () => {
  const queryClient = useQueryClient()
  const [data, setData] = useState<PackageEntity | null>(null)

  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe(event => {
      if (event.query?.queryKey[0] === QUERY_KEY && event.type === 'updated') {
        const cachedData = event.query.state.data as PackageEntity | undefined
        setData(cachedData || null)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [queryClient])

  return data
}
