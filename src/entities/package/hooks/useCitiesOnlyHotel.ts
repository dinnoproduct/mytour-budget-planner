import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { type PackageCity, packageUseCases } from '@entities/package'

export const useCitiesOnlyHotel = (
  options?: Omit<UseQueryOptions<PackageCity[]>, 'queryKey' | 'queryFn'>
) =>
  useQuery({
    ...(options || {}),
    queryFn: () => packageUseCases.getCitiesOnlyHotel(),
    queryKey: ['cities-only-hotel']
  })
