import { PACKAGE_REQUEST_REFETCH_INTERVAL } from '@/shared/configs'
import { type PackageEntity, packageUseCases, type SearchParams } from '..'
import {
  useQuery,
  useQueryClient,
  type UseQueryOptions
} from '@tanstack/react-query'

export const useSearch = (
  search: SearchParams,
  options?: Omit<UseQueryOptions<PackageEntity[]>, 'queryKey' | 'queryFn'>
) =>
  useQuery({
    ...(options || {}),
    refetchInterval: PACKAGE_REQUEST_REFETCH_INTERVAL,
    queryFn: () => packageUseCases.search(search),
    queryKey: ['package-search', search]
  })

export const useSearchAsync = () => {
  const queryClient = useQueryClient()

  return async (
    search: SearchParams,
    options?: Omit<UseQueryOptions<PackageEntity[]>, 'queryKey' | 'queryFn'>
  ) =>
    queryClient.fetchQuery({
      queryKey: ['package-search', search],
      queryFn: () => packageUseCases.search(search),
      staleTime: 0,
      ...options
    })
} 