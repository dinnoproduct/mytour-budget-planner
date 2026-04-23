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

export type ExternalBannerLinkType = 'INTERNAL' | 'EXTERNAL'

export interface ExternalBannerCta {
  title: string
  link: string
  linkType: ExternalBannerLinkType
}

export interface ExternalBanner {
  id: number
  title: string
  description: string
  imageUrl: string | null
  videoUrl: string | null
  cta: ExternalBannerCta | null
  displayOrder: number
}

export type ExternalBannersResponse = Record<string, ExternalBanner[]>
