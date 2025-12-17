import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { type PackageCity, packageUseCases } from '@entities/package'

export const useCities = (
  options?: Omit<UseQueryOptions<PackageCity[]>, 'queryKey' | 'queryFn'>
) =>
  useQuery({
    ...(options || {}),
    queryFn: () => packageUseCases.getCities(),
    queryKey: ['cities']
  })
