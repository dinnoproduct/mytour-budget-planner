import axios, { type AxiosInstance } from 'axios'
import { type ExternalTipsResponse } from '../model/tips'

export class TipsService {
  private readonly api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_URL}/external`,
    })

    this.api.interceptors.response.use(
      (response) => response.data,
      (error) => Promise.reject(error),
    )
  }

  getTips(language: string): Promise<ExternalTipsResponse> {
    return this.api.get('/tips', {
      headers: {
        platform: 'web',
        'Content-Language': language,
      },
    })
  }
}

export const tipsService = new TipsService()
