import {
  useQuery,
  useQueryClient,
  type UseQueryOptions
} from '@tanstack/react-query'
import { packageUseCases } from '@entities/package'
import { useUserContext } from '@entities/user'
import { useTranslation } from 'react-i18next'
import { type LanguageName } from '@shared/model'

export const useRequestCancellationMessage = (
  requestId: number,
  options?: Omit<UseQueryOptions<string>, 'queryFn' | 'queryKey'>
) => {
  const { userToken } = useUserContext()
  const { i18n } = useTranslation()

  return useQuery({
    ...(options || {}),
    queryFn: () =>
      packageUseCases.getCancellationMessage(
        requestId,
        i18n.language as any,
        userToken
      ),
    queryKey: ['request-cancellation-message', requestId]
  })
}

export const useRequestCancellationMessageAsync = () => {
  const { userToken } = useUserContext()
  const queryClient = useQueryClient()

  return async (requestId: number, language: LanguageName) =>
    queryClient.fetchQuery({
      queryFn: () =>
        packageUseCases.getCancellationMessage(
          requestId,
          language as any,
          userToken
        ),
      queryKey: ['request-cancellation-message', requestId]
    })
}
