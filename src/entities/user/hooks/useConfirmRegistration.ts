import { UseMutationOptions, useMutation } from '@tanstack/react-query'
import { UserEntity } from '../model'
import { ConfirmRegistrationParams, userUseCases } from '../api'

export const useConfirmRegistration = (options?: UseMutationOptions<string, unknown, ConfirmRegistrationParams>) => {
	return useMutation({
		mutationKey: ['confirm-registration'],
		mutationFn: userUseCases.confirmRegistration,
		...(options || {})
	})
}