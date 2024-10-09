import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { UserEntity, userUseCases } from '@entities/user'

export const useUser = (
	token: string,
	options?: Omit<UseQueryOptions<UserEntity>, 'queryFn' | 'queryKey'>
) => {
	return useQuery({
		...(options || {}),
		queryFn: () => userUseCases.getUser(token as string),
		queryKey: ['user']
	})
}