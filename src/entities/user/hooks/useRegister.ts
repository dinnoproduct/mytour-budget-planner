import { UseMutationOptions, useMutation } from '@tanstack/react-query'
import { UserEntity } from '../model'
import { RegisterParams, userUseCases } from '../api'

export const useRegister = (options?: UseMutationOptions<UserEntity, unknown, RegisterParams>) => {
	return useMutation({
		mutationKey: ['register'],
		mutationFn: userUseCases.register,
		...(options || {})
	})
}