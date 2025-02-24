import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { type PackageEntity, packageUseCases } from '@entities/package'

export const useHotelPackageByOfferId = (
  offerId: number,
  options?: Omit<UseQueryOptions<PackageEntity>, 'queryFn' | 'queryKey'>
) =>
  useQuery({
    ...(options || {}),
    queryFn: () => packageUseCases.getHotelPackage(offerId),
    queryKey: ['hotel-package', offerId]
  })
