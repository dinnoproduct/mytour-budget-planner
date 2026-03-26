import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { packageUseCases, type GroupTourList } from '@entities/package'
import { PACKAGE_REQUEST_REFETCH_INTERVAL } from '@shared/configs'

export const useGroupToursList = (
	params?: { page?: number | null; limit?: number | null },
	options?: Omit<UseQueryOptions<GroupTourList>, 'queryFn' | 'queryKey'>
) => {
	return useQuery({
	  ...(options || {}),
		refetchInterval: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		staleTime: PACKAGE_REQUEST_REFETCH_INTERVAL,
		queryFn: () => packageUseCases.getGroupTours(params),
		queryKey: ['group-tours', params?.page ?? null, params?.limit ?? null],
	})
}