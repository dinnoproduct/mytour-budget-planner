import { useInfiniteQuery, UseInfiniteQueryOptions } from '@tanstack/react-query'
import { packageUseCases, type GroupTourList } from '@entities/package'
import { PACKAGE_REQUEST_REFETCH_INTERVAL } from '@shared/configs'

export const useGroupToursList = (
	params?: { limit?: number | null },
	options?: Omit<
    UseInfiniteQueryOptions<GroupTourList>,
    'queryFn' | 'queryKey' | 'initialPageParam' | 'getNextPageParam'
  >
) => {
	const limit = params?.limit ?? 8

  return useInfiniteQuery({
    ...(options || {}),
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: PACKAGE_REQUEST_REFETCH_INTERVAL,
    queryKey: ['group-tours', limit],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      packageUseCases.getGroupTours({
        page: pageParam as number,
        limit,
      }),
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage?.pagination?.page ?? 1
      const totalPages = lastPage?.pagination?.totalPages ?? 1
      return currentPage < totalPages ? currentPage + 1 : undefined
    },
  })
}