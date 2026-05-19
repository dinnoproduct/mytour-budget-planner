import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { useUserContext } from '@entities/user'
import { splashNotificationService } from '../api/index'
import { type SplashNotificationViewedPayload } from '../api/types'
import { getGuestUserId } from '../model/guestId'

export const useSplashNotificationViewed = (
  options?: UseMutationOptions<void, unknown, SplashNotificationViewedPayload>,
) => {
  const { user } = useUserContext()

  return useMutation({
    mutationKey: ['splash-notification-viewed'],
    mutationFn: (payload: SplashNotificationViewedPayload) => {
      const userId = user?.id != null ? String(user.id) : getGuestUserId()
      return splashNotificationService.markViewed(payload, userId)
    },
    ...options,
  })
}
