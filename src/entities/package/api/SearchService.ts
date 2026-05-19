import axios, { type AxiosInstance } from 'axios'
import { type SearchParams, type PackageEntity } from '@entities/package'

export class SearchService {
  private readonly apiVersion = 'V2'
  private readonly api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_URL}/${this.apiVersion}/Search/`
    })

    this.api.interceptors.response.use(
      response => response.data,
      error => Promise.reject(error)
    )
  }

  async search(search: SearchParams): Promise<PackageEntity[]> {
    return this.api.post('', search)
  }
}
