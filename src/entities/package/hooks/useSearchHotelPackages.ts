import {
  useQuery,
  useQueryClient,
  type UseQueryOptions
} from '@tanstack/react-query'
import {
  type PackageEntity,
  packageUseCases,
  type SearchHotelPackagesParams,
  type SearchParams
} from '@entities/package'
import { PACKAGE_REQUEST_REFETCH_INTERVAL } from '@shared/configs'

export const useSearchHotelPackages = (
  search: SearchHotelPackagesParams,
  options?: Omit<UseQueryOptions<PackageEntity[]>, 'queryKey' | 'queryFn'>
) =>
  useQuery({
    ...(options || {}),
    refetchInterval: PACKAGE_REQUEST_REFETCH_INTERVAL,
    queryFn: () => packageUseCases.searchHotelPackagesV1(search),
    queryKey: ['search-hotel-packages', search]
  })

export const useSearchHotelPackagesAsync = () => {
  const queryClient = useQueryClient()

  return async (search: SearchParams) =>
    queryClient.fetchQuery({
      queryKey: ['search-hotel-packages', search],
      queryFn: () => packageUseCases.searchHotelPackages(search)
    })
}
