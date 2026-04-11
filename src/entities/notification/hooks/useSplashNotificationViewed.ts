import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { useUserContext } from '@entities/user'
import { splashNotificationService } from '../api/index.ts'
import { type SplashNotificationViewedPayload } from '../api/types.ts'

export const useSplashNotificationViewed = (
  options?: UseMutationOptions<void, unknown, SplashNotificationViewedPayload>,
) => {
  const { userToken } = useUserContext()

  return useMutation({
    mutationKey: ['splash-notification-viewed'],
    mutationFn: (payload: SplashNotificationViewedPayload) =>
      splashNotificationService.markViewed(payload, userToken),
    ...options,
  })
}
