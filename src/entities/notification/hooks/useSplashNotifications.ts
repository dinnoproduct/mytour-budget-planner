import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useUserContext } from '@entities/user'
import { type LanguageName } from '@shared/model'
import { splashNotificationService } from '../api/index.ts'
import { type SplashNotification } from '../api/types.ts'
import { NOTIFICATION_LANGUAGE_MAP } from '../model/constants.ts'
import { getGuestUserId } from '../model/guestId.ts'

export const useSplashNotifications = (
  options?: Omit<
    UseQueryOptions<SplashNotification[]>,
    'queryKey' | 'queryFn'
  >,
) => {
  const { i18n } = useTranslation()
  const { user } = useUserContext()
  const apiLanguage =
    NOTIFICATION_LANGUAGE_MAP[i18n.language as LanguageName] ?? 'en'

  // Logged-in users send their numeric id; guests send a stable UUID from localStorage.
  const userId = user?.id != null ? String(user.id) : getGuestUserId()

  return useQuery({
    ...options,
    staleTime: 10 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
    queryKey: ['splash-notifications', apiLanguage, userId],
    queryFn: () => splashNotificationService.getActive(apiLanguage, userId),
  })
}
