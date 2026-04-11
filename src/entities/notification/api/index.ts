export { SplashNotificationService } from './SplashNotificationService.ts'
export type * from './types.ts'
export { PriceAlertService, priceAlertService } from './PriceAlertService.ts'
export type { PriceAlertSubscribePayload, PriceAlertSubscribeResponse } from './PriceAlertService.ts'

import { SplashNotificationService } from './SplashNotificationService.ts'

export const splashNotificationService = new SplashNotificationService()
