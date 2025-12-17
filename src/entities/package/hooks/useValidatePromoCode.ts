import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import {
  type PromoCodeValidationParams,
  type PromoCodeValidationResponse,
  packageUseCases
} from '@entities/package'
import { useUserContext } from '@entities/user'

export const useValidatePromoCode = (
  options: UseMutationOptions<
    PromoCodeValidationResponse,
    unknown,
    Omit<PromoCodeValidationParams, 'userId'>
  > = {}
) => {
  const { user, userToken } = useUserContext()

  return useMutation({
    mutationKey: ['validate-promo-code'],
    mutationFn: (data: Omit<PromoCodeValidationParams, 'userId'>) => {
      const userId = user?.id || 0

      return packageUseCases.validatePromoCode(
        {
          ...data,
          userId
        },
        userToken
      )
    },
    onError: (error: any) => {
      console.error(error)
    },
    ...options
  })
}
