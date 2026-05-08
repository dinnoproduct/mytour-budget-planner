import axios, { type AxiosInstance } from 'axios'
import { 
  type PaymentSystemInfo
} from '@entities/package'

const API_VERSION = 'v2'

export class RequestServiceV2 {
  private readonly api: AxiosInstance
  constructor() {
    this.api = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_URL}/${API_VERSION}/request`
    })

    this.api.interceptors.response.use(
      response => response.data,
      error => Promise.reject(error)
    )
  }

  getPaymentSystems(
    travelAgencyId: number,
    token: string
  ): Promise<PaymentSystemInfo[]> {
    return this.api.get('PaymentSystems', {
      params: { travelAgencyId },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }


}
