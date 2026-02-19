import axios, { type AxiosRequestConfig } from 'axios'
import {
  type PackageEntity, // TODO: add type for group tours
} from '@entities/package'

export class GroupTourService {
  private readonly baseUrl = `${import.meta.env.VITE_API_URL}`

  private async request<T>(
    config: AxiosRequestConfig & { version?: 'V2' }
  ): Promise<T> {
    const { version, ...restConfig } = config
    const api = axios.create({
      baseURL: this.baseUrl
    })

    api.interceptors.response.use(
      response => response.data,
      error => Promise.reject(error)
    )

    const url = version
      ? `/${version}/search${restConfig.url}`
      : `/search${restConfig.url}`

    return api({
      ...restConfig,
      url
    })
  }

  // package
  async getGroupTours(): Promise<any[]> {
    return this.request<any[]>({
      url: '/getGroupTours',
      version: 'V2'
    })
  }
}