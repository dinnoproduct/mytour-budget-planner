import axios, { type AxiosInstance } from 'axios'

export interface PriceAlertSubscribePayload {
  hotelUrl: string
  fullName: string
  email: string
  phoneNumber: string
  cities: number[]
  adults: number
  childs: number[]
  dateFrom: string
  dateTo: string
  hotelId: string
}

export interface PriceAlertSubscribeResponse {
  success: boolean
}

export class PriceAlertService {
  private readonly api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: `${import.meta.env.VITE_API_URL}`,
    })

    this.api.interceptors.response.use(
      (response) => response.data,
      (error) => Promise.reject(error),
    )
  }

  subscribe(payload: PriceAlertSubscribePayload): Promise<PriceAlertSubscribeResponse> {
    return this.api.post('/external/price-alerts-subscribe', payload)
  }
}

export const priceAlertService = new PriceAlertService()
