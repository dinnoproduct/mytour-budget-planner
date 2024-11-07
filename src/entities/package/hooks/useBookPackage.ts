import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import {
  type BookPackageInput,
  type BookPackageResponse,
  packageUseCases
} from '@entities/package'
import { useUserContext } from '@entities/user'
import { useTranslation } from 'react-i18next'
import { LANGUAGE_NAME_MAP, type LanguageName } from '@shared/model'

export const useBookPackage = (
  options: UseMutationOptions<
    BookPackageResponse,
    unknown,
    BookPackageInput
  > = {}
) => {
  const { userToken } = useUserContext()
  const { i18n } = useTranslation()

  return useMutation({
    mutationKey: ['book-package'],
    mutationFn: (data: BookPackageInput) =>
      packageUseCases.bookPackage(data, userToken),
    onSuccess: (data: BookPackageResponse) => {
      window.location.href =
        data.bookingPaymentUrl +
        `&lang=${LANGUAGE_NAME_MAP[i18n.language as LanguageName]}`
    },
    onError: (error: any) => {
      console.error(error)
    },
    ...options
  })
}
