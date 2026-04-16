import axios, { type AxiosInstance } from 'axios'

export interface HotelInquiryPayload {
  phone: string
  fullName: string
  email: string
  hotelName: string
  cityName: string
  dateFrom: string
  dateTo: string
  adults: number
  childs: number[]
}

export interface HotelInquiryResponse {
  success?: boolean
}

export class HotelInquiriesService {
  private readonly api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
    })

    this.api.interceptors.response.use(
      (response) => response.data,
      (error) => Promise.reject(error),
    )
  }

  createInquiry(payload: HotelInquiryPayload): Promise<HotelInquiryResponse> {
    return this.api.post('/External/Hotel-Inquiries', payload)
  }
}

export const hotelInquiriesService = new HotelInquiriesService()
