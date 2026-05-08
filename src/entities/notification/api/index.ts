export { SplashNotificationService } from './SplashNotificationService'
export type * from './types'
export { PriceAlertService, priceAlertService } from './PriceAlertService'
export type { PriceAlertSubscribePayload, PriceAlertSubscribeResponse } from './PriceAlertService'
export { HotelInquiriesService, hotelInquiriesService } from './HotelInquiriesService'
export type { HotelInquiryPayload, HotelInquiryResponse } from './HotelInquiriesService'
export { BannerService, bannerService } from './BannerService'

import { SplashNotificationService } from './SplashNotificationService'

export const splashNotificationService = new SplashNotificationService()
