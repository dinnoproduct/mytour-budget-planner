import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { packageUseCases, type GroupTourEntity } from '@entities/package'
import { PACKAGE_REQUEST_REFETCH_INTERVAL } from '@shared/configs'

export const useGroupToursList = (
	options?: Omit<UseQueryOptions<GroupTourEntity[]>, 'queryFn' | 'queryKey'>
) => {
	return useQuery({
	  ...(options || {}),
		refetchInterval: PACKAGE_REQUEST_REFETCH_INTERVAL,
		queryFn: () => packageUseCases.getGroupTours(),
		queryKey: ['group-tours'],
	})
}