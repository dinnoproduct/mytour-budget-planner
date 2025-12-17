import { UseMutationOptions, useMutation } from '@tanstack/react-query'
import { UserEntity } from '../model'
import { ConfirmLoginParams, userUseCases } from '../api'

export const useConfirmLogin = (options?: UseMutationOptions<string, unknown, ConfirmLoginParams>) => {
	return useMutation({
		mutationKey: ['confirm-login'],
		mutationFn: userUseCases.confirmLogin,
		...(options || {})
	})
}