import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { packageUseCases } from '@entities/package'
import { PACKAGE_REQUEST_REFETCH_INTERVAL } from '@shared/configs'

export const useGroupToursList = (
	options?: Omit<UseQueryOptions<any[]>, 'queryFn' | 'queryKey'>
) => {
	return useQuery({
	  ...(options || {}),
		refetchInterval: PACKAGE_REQUEST_REFETCH_INTERVAL,
		queryFn: () => packageUseCases.getGroupTours(),
		queryKey: ['group-tours'],
	})
}