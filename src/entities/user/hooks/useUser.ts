import {
  useQuery,
  useQueryClient,
  type UseQueryOptions
} from '@tanstack/react-query'
import { type UserEntity, userUseCases } from '@entities/user'

export const useUser = (
  token: string,
  options?: Omit<UseQueryOptions<UserEntity>, 'queryFn' | 'queryKey'>
) =>
  useQuery({
    ...(options || {}),
    queryFn: () => userUseCases.getUser(token),
    queryKey: ['user']
  })

export const useSetUser = () => {
  const queryClient = useQueryClient()

  return (newUser: UserEntity | null) => {
    queryClient.setQueryData(['user'], newUser)
  }
}
