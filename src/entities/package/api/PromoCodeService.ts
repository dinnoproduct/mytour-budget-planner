import axios, { type AxiosInstance } from 'axios'
import {
  type PromoCodeValidationParams,
  type PromoCodeValidationResponse
} from './types.ts'

export class PromoCodeService {
  private readonly apiVersion = 'V2'
  private readonly api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: `${import.meta.env.VITE_API_URL}/${this.apiVersion}/PromoCode/`
    })

    this.api.interceptors.response.use(
      response => response.data,
      error => Promise.reject(error)
    )
  }

  async validate(
    params: PromoCodeValidationParams,
    token: string
  ): Promise<PromoCodeValidationResponse> {
    return this.api.post('/Validate', params, {
      headers: {
        Authorization: `Bearer ${token}`,
        Platform: 'Web'
      }
    })
  }
}
