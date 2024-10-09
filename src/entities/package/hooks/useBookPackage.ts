import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { BookPackageInput, BookPackageResponse, packageUseCases } from '@entities/package'
import { useUserContext } from '@entities/user'

export const useBookPackage = (
	options: UseMutationOptions<BookPackageResponse, unknown, BookPackageInput> = {}
) => {
	const { userToken } = useUserContext()

	return useMutation(
		{
			mutationKey: ['book-package'],
			mutationFn: (data: BookPackageInput) => packageUseCases.bookPackage(data, userToken),
			onSuccess: (data: BookPackageResponse) => {
				window.location.href = data.bookingPaymentUrl
			},
			onError: (error: any) => {
				console.error(error)
			},
			...options
		}
	)
}

