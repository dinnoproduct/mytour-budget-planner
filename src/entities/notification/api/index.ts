export { SplashNotificationService } from './SplashNotificationService.ts'
export type * from './types.ts'
export { PriceAlertService, priceAlertService } from './PriceAlertService.ts'
export type { PriceAlertSubscribePayload, PriceAlertSubscribeResponse } from './PriceAlertService.ts'
export { HotelInquiriesService, hotelInquiriesService } from './HotelInquiriesService.ts'
export type { HotelInquiryPayload, HotelInquiryResponse } from './HotelInquiriesService.ts'

import { SplashNotificationService } from './SplashNotificationService.ts'

export const splashNotificationService = new SplashNotificationService()
