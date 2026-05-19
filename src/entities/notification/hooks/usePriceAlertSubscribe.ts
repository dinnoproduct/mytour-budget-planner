import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import {
  priceAlertService,
  type PriceAlertSubscribePayload,
  type PriceAlertSubscribeResponse,
} from '../api/PriceAlertService'

export const usePriceAlertSubscribe = (
  options?: UseMutationOptions<
    PriceAlertSubscribeResponse,
    unknown,
    PriceAlertSubscribePayload
  >,
) => {
  return useMutation({
    mutationKey: ['price-alert-subscribe'],
    mutationFn: async (payload: PriceAlertSubscribePayload) => {
      const response = await priceAlertService.subscribe(payload)
      if (!response?.success) {
        throw new Error('subscription_failed')
      }
      return response
    },
    ...options,
  })
}
