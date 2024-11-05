import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { packageUseCases, type UpdateRequestInput } from '@entities/package'
import { useUserContext } from '@entities/user'

export const useUpdateRequest = (
  options: UseMutationOptions<boolean, unknown, UpdateRequestInput> = {}
) => {
  const { userToken } = useUserContext()

  return useMutation({
    mutationFn: (data: UpdateRequestInput) =>
      packageUseCases.updateRequest(data, userToken),
    ...options
  })
}
