import axios, { type AxiosRequestConfig } from 'axios'
import {
  type GroupTourEntity,
  type GroupTourList,
  type GroupTourInfo,
  type CreateGroupTourOfferInput,
  type GroupTourOfferPrice,
} from '@entities/package'

export class GroupTourService {
  private readonly baseUrl = `${process.env.NEXT_PUBLIC_API_URL}`

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

  async getGroupTours(params?: { page?: number | null; limit?: number | null }): Promise<GroupTourList> {
    const searchParams = new URLSearchParams()
    if (params?.page) {
      searchParams.set('page', String(params.page))
    }
    if (params?.limit) {
      searchParams.set('limit', String(params.limit))
    }

    const query = searchParams.toString()
    const url = query ? `/getGroupTours?${query}` : '/getGroupTours'

    const response = await this.request<GroupTourList | GroupTourEntity[]>({
      url,
      version: 'V2'
    })

    // Backward compatibility: normalize old array response into paginated shape.
    if (Array.isArray(response)) {
      return {
        data: response,
        pagination: {
          page: 1,
          limit: response.length,
          total: response.length,
          totalPages: 1,
        },
      }
    }

    return response
  }

  async getGroupTourInfo(tourId: string): Promise<GroupTourInfo> {
    return this.request<GroupTourInfo>({
      url: `/getGroupTourInfo/${tourId}`,
      version: 'V2'
    })
  }

  async createGroupTourOffer(
    body: CreateGroupTourOfferInput
  ): Promise<GroupTourOfferPrice> {
    return this.request<GroupTourOfferPrice>({
      url: '/CreateGroupTourOffer',
      method: 'POST',
      data: body,
      version: 'V2'
    })
  }
}