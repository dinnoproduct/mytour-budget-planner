import axios, { type AxiosRequestConfig } from 'axios'
import {
  type GenerateHotelOffersInput,
  type GenerateOffersInput,
  type OfferEntity,
  type PackageEntity,
  type SearchPackagesParams
} from '@entities/package'

export class PackageService {
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
      ? `/${version}/package${restConfig.url}`
      : `/package${restConfig.url}`

    return api({
      ...restConfig,
      url
    })
  }

  // package
  async getPackageList(): Promise<PackageEntity[]> {
    return this.request<PackageEntity[]>({
      url: '/V2/getPackages'
    })
  }

  async searchPackages(search: SearchPackagesParams): Promise<PackageEntity[]> {
    return this.request<PackageEntity[]>({
      url: '/searchPackages',
      method: 'post',
      data: search
    })
  }

  async getPackage(offerId: number): Promise<PackageEntity> {
    return this.request<PackageEntity>({
      url: `/getPackage/?id=${offerId}`
    })
  }

  async generateOffers(input: GenerateOffersInput): Promise<OfferEntity[]> {
    return this.request<OfferEntity[]>({
      url: '/generateOffers',
      method: 'post',
      data: input
    })
  }

  //hotel

  async generateHotelOffers(
    input: GenerateHotelOffersInput
  ): Promise<OfferEntity[]> {
    return this.request<OfferEntity[]>({
      url: '/generateHotelOffers/',
      method: 'post',
      version: 'V2',
      data: input
    })
  }

  async getHotelPackage(
    offerId: number,
    travelAgency: number
  ): Promise<PackageEntity> {
    return this.request<PackageEntity>({
      url: `/getHotelPackage/?id=${offerId}&travelAgancy=${travelAgency}`
    })
  }
}
