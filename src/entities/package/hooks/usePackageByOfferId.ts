import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { type PackageEntity, packageUseCases } from '@entities/package'
import { PACKAGE_REQUEST_REFETCH_INTERVAL } from '@shared/configs'

export const usePackageByOfferId = (
  offerId: number,
  options?: Omit<UseQueryOptions<PackageEntity>, 'queryFn' | 'queryKey'>
) =>
  useQuery({
    ...(options || {}),
    refetchInterval: PACKAGE_REQUEST_REFETCH_INTERVAL,
    queryFn: () => packageUseCases.getPackage(offerId),
    queryKey: ['package', offerId]
  })
