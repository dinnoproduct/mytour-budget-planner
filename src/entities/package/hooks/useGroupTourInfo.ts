import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { packageUseCases, type GroupTourInfo } from '@entities/package'

export const useGroupTourInfo = (
  tourId: string | undefined,
  options?: Omit<UseQueryOptions<GroupTourInfo>, 'queryFn' | 'queryKey'>
) => {
  return useQuery({
    ...(options || {}),
    queryKey: ['group-tour-info', tourId],
    queryFn: () => packageUseCases.getGroupTourInfo(tourId!),
    enabled: Boolean(tourId),
  })
}
