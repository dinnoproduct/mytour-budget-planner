import axios, { type AxiosInstance } from 'axios'
import { type PackageCity } from '@entities/package'

export class CityService {
  private readonly api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_URL}/city`
    })

    this.api.interceptors.response.use(
      response => response.data,
      error => Promise.reject(error)
    )
  }

  getCitiesOnlyHotel(): Promise<PackageCity[]> {
    return this.api(`getCitiesOnlyHotel`)
  }

  getCities(): Promise<PackageCity[]> {
    return this.api(`getCities`)
  }
}
