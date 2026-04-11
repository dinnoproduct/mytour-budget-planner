import axios, { type AxiosInstance } from 'axios'
import {
  type SplashNotification,
  type SplashNotificationViewedPayload,
} from './types.ts'

export class SplashNotificationService {
  private readonly api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: `${import.meta.env.VITE_API_URL}/external`,
    })

    this.api.interceptors.response.use(
      (response) => response.data,
      (error) => Promise.reject(error),
    )
  }

  getActive(language: string, token: string): Promise<SplashNotification[]> {
    return this.api.get('/SplashNotifications', {
      headers: {
        Authorization: `Bearer ${token}`,
        platform: 'web',
        'Content-Language': language,
        limit: 1,
      },
    })
  }

  markViewed(
    payload: SplashNotificationViewedPayload,
    token: string,
  ): Promise<void> {
    return this.api.post('/SplashNotificationViewed', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        platform: 'web',
      },
    })
  }
}
