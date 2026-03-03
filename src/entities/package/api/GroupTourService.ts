import axios, { type AxiosRequestConfig } from 'axios'
import {
  type GroupTourEntity,
  type GroupTourInfo,
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
      ? `/${version}/GroupTours${restConfig.url}`
      : `/GroupTours${restConfig.url}`

    return api({
      ...restConfig,
      url
    })
  }

  async getGroupTours(): Promise<GroupTourEntity[]> {
    return this.request<GroupTourEntity[]>({
      url: '/getGroupTours',
      version: 'V2'
    })
  }

  async getGroupTourInfo(tourId: string): Promise<GroupTourInfo> {
    return this.request<GroupTourInfo>({
      url: `/getGroupTourInfo/${tourId}`,
      version: 'V2'
    })
  }
}