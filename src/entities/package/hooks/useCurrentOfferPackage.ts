import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import { PackageEntity, packageUseCases } from '@entities/package'
import { PACKAGE_REQUEST_REFETCH_INTERVAL } from '@shared/configs'

export const useCurrentOfferPackage = (
	offerId?: number,
	options?: Omit<UseQueryOptions<PackageEntity>, 'queryFn' | 'queryKey'>
) => {
	const queryClient = useQueryClient()

	return useQuery({
		...(options || {}),
		refetchInterval: PACKAGE_REQUEST_REFETCH_INTERVAL,
		queryFn: () =>
			offerId
				? packageUseCases.getPackage(offerId)
				: queryClient.getQueryData<PackageEntity>(
					['current-offer-package']
				) as PackageEntity,
		queryKey: ['current-offer-package']
	})
}