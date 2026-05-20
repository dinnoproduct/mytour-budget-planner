import axios, { type AxiosRequestConfig } from 'axios'
import {
  type GenerateHotelOffersInput,
  type GenerateOffersInput,
  type OfferEntity,
  type PackageCity,
  type PackageEntity,
  type PackageHotel,
  type SearchPackagesParams
} from '@entities/package'

type ReviewHotelEntity = PackageHotel & { city: PackageCity }

export class PackageService {
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

  async getPackage(offerId: number, travelAgency: number): Promise<PackageEntity> {
    return this.request<PackageEntity>({
      url: `/getPackage?id=${offerId}&travelAgancy=${travelAgency}`
    })
  }

  async generateOffers(input: GenerateOffersInput, params: { travelAgency: number }): Promise<OfferEntity[]> {
    return this.request<OfferEntity[]>({
      url: `/generateOffers?travelAgency=${params.travelAgency}`,
      method: 'post',
      data: input,
      version: 'V2',
    })
  }

  //hotel

  async generateHotelOffers(
    input: GenerateHotelOffersInput
  ): Promise<OfferEntity[]> {
    return this.request<OfferEntity[]>({
      url: `/generateHotelOffers/?travelAgency=${input.travelAgency}`,
      method: 'post',
      version: 'V2',
      data: {
        checkin: input.checkin,
        checkout: input.checkout,
        hotelId: input.hotelId,
        adults: input.adults,
        childs: input.childs,
      }
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

  private async rawRequest<T>(config: AxiosRequestConfig): Promise<T> {
    const api = axios.create({
      baseURL: this.baseUrl
    })

    api.interceptors.response.use(
      response => response.data,
      error => Promise.reject(error)
    )

    return api(config)
  }

  async getReviewHotelMeta(id: number): Promise<ReviewHotelEntity> {
    return this.rawRequest<ReviewHotelEntity>({
      url: '/hotel/gethotel',
      params: { id }
    })
  }
}
