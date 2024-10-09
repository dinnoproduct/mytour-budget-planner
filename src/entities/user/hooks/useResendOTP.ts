import { UseMutationOptions, useMutation } from '@tanstack/react-query'
import { ResendOtpParams, userUseCases } from '../api'

export const useResendOTP = (options?: UseMutationOptions<void, unknown, ResendOtpParams>) => {
	return useMutation({
		mutationKey: ['resend-otp'],
		mutationFn: userUseCases.resendOTP,
		...(options || {})
	})
}