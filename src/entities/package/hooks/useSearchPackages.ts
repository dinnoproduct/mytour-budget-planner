import {
  useQuery,
  useQueryClient,
  type UseQueryOptions
} from '@tanstack/react-query'
import {
  type PackageEntity,
  type SearchPackagesParams,
  type SearchParams,
  packageUseCases
} from '@entities/package'
import { PACKAGE_REQUEST_REFETCH_INTERVAL } from '@shared/configs'

export const useSearchPackages = (
  search: SearchPackagesParams,
  options?: Omit<UseQueryOptions<PackageEntity[]>, 'queryKey' | 'queryFn'>
) =>
  useQuery({
    ...(options || {}),
    refetchInterval: PACKAGE_REQUEST_REFETCH_INTERVAL,
    queryFn: () => packageUseCases.searchPackagesV1(search),
    queryKey: ['search-packagesV1', search]
  })

export const useSearchPackagesAsync = () => {
  const queryClient = useQueryClient()

  return async (search: SearchParams) =>
    queryClient.fetchQuery({
      queryKey: ['search-packages', search],
      queryFn: () => packageUseCases.searchPackages(search)
    })
}
