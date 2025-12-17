import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { packageUseCases, type RequestEntity } from '@entities/package'
import { useUserContext } from '@entities/user'

export const useUserRequests = (
  options?: Omit<UseQueryOptions<RequestEntity[]>, 'queryFn' | 'queryKey'>
) => {
  const { userToken } = useUserContext()

  return useQuery({
    ...(options || {}),
    queryFn: () => packageUseCases.getUserRequests(userToken),
    queryKey: ['user-requests']
  })
}
