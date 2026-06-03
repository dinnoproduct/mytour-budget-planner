import axios, { type AxiosInstance } from 'axios'
import {
  type CreateVisaRequestPayload,
  type CreateVisaRequestResponse,
} from '../model/visaRequest'

export class VisaRequestService {
  private readonly api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_URL}/V2/VisaRequests`,
    })

    this.api.interceptors.response.use(
      (response) => response.data,
      (error) => Promise.reject(error),
    )
  }

  createVisaRequest(
    payload: CreateVisaRequestPayload,
    token: string,
  ): Promise<CreateVisaRequestResponse> {
    return this.api.post('/CreateVisaResuest', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        Platform: 'Web',
      },
    })
  }
}

export const visaRequestService = new VisaRequestService()
