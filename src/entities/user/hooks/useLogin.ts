import { UseMutationOptions, useMutation } from '@tanstack/react-query'
import { UserEntity } from '../model'
import { LoginParams, userUseCases } from '../api'

export const useLogin = (options?: UseMutationOptions<UserEntity, unknown, LoginParams>) => {
	return useMutation({
		mutationKey: ['login'],
		mutationFn: userUseCases.login,
		...(options || {})
	})
}