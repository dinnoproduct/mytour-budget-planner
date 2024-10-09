import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import { PackageEntity, packageUseCases } from '@entities/package'
import { PACKAGE_REQUEST_REFETCH_INTERVAL } from '@shared/configs'

export const useCurrentOfferPackage = (
	offerId: number,
	options?: Omit<UseQueryOptions<PackageEntity>, 'queryFn' | 'queryKey'>
) => {
	return useQuery({
		...(options || {}),
		refetchInterval: PACKAGE_REQUEST_REFETCH_INTERVAL,
		queryFn: () => packageUseCases.getPackage(offerId),
		queryKey: ['current-offer-package']
	})
}

export const useGetCurrentOfferPackage = () => {
	const queryClient = useQueryClient()

	return queryClient.getQueryData<PackageEntity>(['current-offer-package'])
}