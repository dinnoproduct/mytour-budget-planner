import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { PackageEntity, packageUseCases, RequestEntity } from '@entities/package'
import { PACKAGE_REQUEST_REFETCH_INTERVAL } from '@shared/configs'
import { useUserContext } from '@entities/user'
import { useTranslation } from 'react-i18next'

export const useRequestCancellationMessage = (
	requestId: number,
	options?: Omit<string, 'queryFn' | 'queryKey'>
) => {
	const { userToken } = useUserContext()
	const {i18n} = useTranslation()

	return useQuery({
	  ...(options || {}),
		queryFn: () => packageUseCases.getCancellationMessage(requestId, i18n.language as any, userToken),
		queryKey: ['request-cancellation-message', requestId],
	})
}