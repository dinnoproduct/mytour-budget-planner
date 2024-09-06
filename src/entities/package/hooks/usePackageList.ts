import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { PackageEntity, packageUseCases } from '@entities/package'
import { PACKAGE_REQUEST_REFETCH_INTERVAL } from '@shared/configs'

export const usePackageList = (
	options?: UseQueryOptions<PackageEntity[]>
) => {
	return useQuery({
	  ...(options || {}),
		refetchInterval: PACKAGE_REQUEST_REFETCH_INTERVAL,
		queryFn: () => packageUseCases.getPackageList(),
		queryKey: ['packages'],
	})
}