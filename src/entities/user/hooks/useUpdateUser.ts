import {
  type UseMutationOptions,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'
import { type UpdateUserInput, userUseCases } from '../api'
import { useUserContext } from '@entities/user'

export const useUpdateUser = (
  options?: UseMutationOptions<boolean, unknown, UpdateUserInput>
) => {
  const { userToken } = useUserContext()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['update-user'],
    mutationFn: (data: UpdateUserInput) =>
      userUseCases.updateUser(userToken, data),
    ...(options || {}),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user']
      })
    }
  })
}
