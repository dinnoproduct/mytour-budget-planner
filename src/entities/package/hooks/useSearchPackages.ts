import {
  useQuery,
  useQueryClient,
  type UseQueryOptions
} from '@tanstack/react-query'
import {
  type PackageEntity,
  packageUseCases,
  type SearchPackagesParams
} from '@entities/package'
import { PACKAGE_REQUEST_REFETCH_INTERVAL } from '@shared/configs'

export const useSearchPackages = (
  search: SearchPackagesParams,
  options?: Omit<UseQueryOptions<PackageEntity[]>, 'queryKey' | 'queryFn'>
) =>
  useQuery({
    ...(options || {}),
    refetchInterval: PACKAGE_REQUEST_REFETCH_INTERVAL,
    queryFn: () => packageUseCases.searchPackages(search),
    queryKey: ['search-packages', search]
  })

export const useSearchPackagesAsync = () => {
  const queryClient = useQueryClient()

  return async (search: SearchPackagesParams) =>
    queryClient.fetchQuery({
      queryKey: ['search-packages', search],
      queryFn: () => packageUseCases.searchPackages(search)
    })
}
