import { useState, useEffect, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useSplashNotifications } from '../hooks/useSplashNotifications'
import { useSplashNotificationViewed } from '../hooks/useSplashNotificationViewed'
import { SplashNotificationModal } from './SplashNotificationModal'
import { type SplashNotification } from '../api/types'

export const SplashNotificationsManager = () => {
  const queryClient = useQueryClient()
  const { data } = useSplashNotifications()
  const { mutate: markViewed } = useSplashNotificationViewed()

  const notification = data?.[0] ?? null

  // Keep a stable reference so the modal can animate out after dismiss
  const [displayed, setDisplayed] = useState<SplashNotification | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (notification) {
      setDisplayed(notification)
      setIsOpen(true)
    }
  }, [notification])

  const dismiss = useCallback(() => {
    if (!displayed) return
    markViewed({ notificationId: displayed.id })
    // Set cached response to empty so navigating back within the 5-min
    // stale window won't re-show the notification.
    // After staleTime expires, the next homepage mount triggers a fresh GET.
    queryClient.setQueriesData<SplashNotification[]>(
      { queryKey: ['splash-notifications'] },
      [],
    )
    setIsOpen(false)
  }, [displayed, markViewed, queryClient])

  const handleClose = dismiss
  const handleCtaClick = dismiss

  if (!displayed) return null

  return (
    <SplashNotificationModal
      notification={displayed}
      isOpen={isOpen}
      onClose={handleClose}
      onCtaClick={handleCtaClick}
    />
  )
}
