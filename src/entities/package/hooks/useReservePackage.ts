import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import {
  packageUseCases,
  type ReservePackageInput,
  type ReservePackageResponse
} from '@entities/package'
import { useUserContext } from '@entities/user'

export const useReservePackage = (
  options: UseMutationOptions<
    ReservePackageResponse,
    unknown,
    ReservePackageInput
  > = {}
) => {
  const { userToken } = useUserContext()

  return useMutation({
    mutationKey: ['reserve-package'],
    mutationFn: (data: ReservePackageInput) =>
      packageUseCases.reservePackage(data, userToken),
    onError: (error: any) => {
      console.error(error)
    },
    ...options
  })
}
