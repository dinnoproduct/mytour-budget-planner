import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { type BookPackageResponse, packageUseCases } from '@entities/package'
import { useUserContext } from '@entities/user'
import { useTranslation } from 'react-i18next'
import { LANGUAGE_NAME_MAP, type LanguageName } from '@shared/model'

export type PayRemainingAmountParams = {
  requestId: number
  paymentSystem?: string
  amountToBePaid?: number
}

export const usePayRemainingAmount = (
  options: UseMutationOptions<
    BookPackageResponse,
    unknown,
    PayRemainingAmountParams | number
  > = {}
) => {
  const { userToken } = useUserContext()
  const { i18n } = useTranslation()

  return useMutation({
    mutationFn: (params: PayRemainingAmountParams | number) => {
      const requestId =
        typeof params === 'number' ? params : params.requestId
      const paymentSystem =
        typeof params === 'number' ? undefined : params.paymentSystem
      const amountToBePaid =
        typeof params === 'number' ? undefined : params.amountToBePaid
      return packageUseCases.payRemainingAmount(
        requestId,
        userToken,
        paymentSystem,
        amountToBePaid
      )
    },
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
