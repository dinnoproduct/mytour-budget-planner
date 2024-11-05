import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { type CreateRequestInput, packageUseCases } from '@entities/package'
import { useUserContext } from '@entities/user'

export const useCreateRequest = (
  options: UseMutationOptions<number, unknown, CreateRequestInput> = {}
) => {
  const { userToken } = useUserContext()

  return useMutation({
    mutationFn: (data: CreateRequestInput) =>
      packageUseCases.createRequest(data, userToken),
    ...options
  })
}
