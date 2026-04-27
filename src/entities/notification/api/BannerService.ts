import axios, { type AxiosInstance } from 'axios'
import { type ExternalBannersResponse } from './types'

export class BannerService {
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

  getBanners(language: string): Promise<ExternalBannersResponse> {
    return this.api.get('/Banners', {
      headers: {
        platform: 'web',
        'Content-Language': language,
      },
    })
  }
}

export const bannerService = new BannerService()
