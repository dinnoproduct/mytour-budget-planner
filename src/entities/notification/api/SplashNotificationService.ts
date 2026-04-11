import axios, { type AxiosInstance } from 'axios'
import {
  type SplashNotification,
  type SplashNotificationViewedPayload,
} from './types.ts'

export class SplashNotificationService {
  private readonly api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: `${import.meta.env.VITE_API_URL}/v2/external`,
    })

    this.api.interceptors.response.use(
      (response) => response.data,
      (error) => Promise.reject(error),
    )
  }

  getActive(language: string, userId: string): Promise<SplashNotification[]> {
    return this.api.get('/SplashNotifications', {
      params: { userId },
      headers: {
        platform: 'web',
        'Content-Language': language,
        limit: 1,
      },
    })
  }

  markViewed(
    payload: SplashNotificationViewedPayload,
    userId: string,
  ): Promise<void> {
    return this.api.post('/SplashNotificationViewed', payload, {
      params: { userId },
      headers: {
        platform: 'web',
      },
    })
  }
}
