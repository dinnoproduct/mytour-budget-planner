import {
  useMutation,
  type UseMutationOptions,
  useQueryClient
} from '@tanstack/react-query'
import { packageUseCases, type RequestEntity } from '@entities/package'
import { useUserContext } from '@entities/user'

export const useCancelRequest = (
  options: UseMutationOptions<boolean, unknown, number> = {}
) => {
  const { userToken } = useUserContext()
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (requestId: number) =>
      packageUseCases.cancelRequest(requestId, userToken),
    onSuccess: (data, requestId, context) => {
      queryClient.setQueryData<RequestEntity[]>(
        ['user-requests'],
        oldRequests =>
          oldRequests
            ? oldRequests.map(request =>
              request?.id === requestId ? { ...request, status: 6 } : request
            )
            : []
      )

      options.onSuccess?.(data, requestId, context)
    },
    onError: (error: any) => {
      console.error(error)
    }
  })
}
