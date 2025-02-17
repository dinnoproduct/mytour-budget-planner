import axios, { type AxiosInstance } from 'axios'
import {
  type GenerateHotelOffersInput,
  type GenerateOffersInput,
  type OfferEntity,
  type PackageEntity,
  type SearchHotelPackagesParams,
  type SearchPackagesParams
} from '@entities/package'

export class PackageService {
  private readonly apiVersion = 'V2'
  private readonly api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: `${import.meta.env.VITE_API_URL}/package/`
    })

    this.api.interceptors.response.use(
      response => response.data,
      error => Promise.reject(error)
    )
  }

  // package
  async getPackageList(): Promise<PackageEntity[]> {
    return this.api(`/${this.apiVersion}/getPackages`)
  }

  async searchPackages(search: SearchPackagesParams): Promise<PackageEntity[]> {
    return this.api.post('searchPackages', search)
  }

  async getPackage(offerId: number): Promise<PackageEntity> {
    return this.api(`/getPackage/?id=${offerId}`)
  }

  async generateOffers(input: GenerateOffersInput): Promise<OfferEntity[]> {
    return this.api.post('generateOffers', input)
  }

  //hotel
  async searchHotelPackages(
    search: SearchHotelPackagesParams
  ): Promise<PackageEntity[]> {
    return this.api.post('searchHotelPackages', search)
  }

  async generateHotelOffers(
    input: GenerateHotelOffersInput
  ): Promise<OfferEntity[]> {
    return this.api.post('/generateHotelOffers/?travelAgancy=3', input)
  }

  async getHotelPackage(offerId: number): Promise<PackageEntity> {
    return this.api(`/getHotelPackage/?id=${offerId}&travelAgancy=3`)
  }
}
