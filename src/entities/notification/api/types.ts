export type SplashNotificationCtaType = 'INTERNAL' | 'EXTERNAL'
export type SplashNotificationAssetType = 'IMAGE' | 'VIDEO'

export interface SplashNotificationCta {
  title: string
  url: string
  type: SplashNotificationCtaType
}

export interface SplashNotificationAsset {
  type: SplashNotificationAssetType
  assets: string[]
}

export interface SplashNotification {
  id: number
  title: string
  description: string
  cta: SplashNotificationCta
  asset: SplashNotificationAsset
  priorityOrder: number
}

export interface SplashNotificationViewedPayload {
  notificationId: number
}
