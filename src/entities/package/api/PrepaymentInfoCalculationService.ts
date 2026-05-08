import axios, { type AxiosInstance } from 'axios'
import {
  PaymentSystemInfo,
  type PrepaymentCalculationParams,
  type PrepaymentInfo
} from './types'

export class PrepaymentInfoCalculationService {
  private readonly apiVersion = 'V2'
  private readonly api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: `${
        process.env.NEXT_PUBLIC_API_URL
      }/${this.apiVersion}/PrepaymentInfoCalculation/`
    })

    this.api.interceptors.response.use(
      response => response.data,
      error => Promise.reject(error)
    )
  }

  async calculate(
    params: PrepaymentCalculationParams
  ): Promise<PrepaymentInfo> {
    return this.api.post('Calculate', params)
  }
} 