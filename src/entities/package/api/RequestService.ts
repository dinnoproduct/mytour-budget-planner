import axios, { type AxiosInstance } from 'axios'
import {
  type BookPackageInput,
  type BookPackageResponse,
  type CreateRequestInput,
  type RequestEntity,
  type UpdateRequestInput
} from '@entities/package'
import { type LanguageName } from '@shared/model'

export class RequestService {
  private readonly api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: `${import.meta.env.VITE_API_URL}/request`
    })

    this.api.interceptors.response.use(
      response => response.data,
      error => Promise.reject(error)
    )
  }

  bookPackage(
    input: BookPackageInput,
    token: string
  ): Promise<BookPackageResponse> {
    return this.api.post('book', input, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  payRemainingAmount(
    requestId: number,
    token: string
  ): Promise<BookPackageResponse> {
    return this.api.post(
      'payRemainderAmount',
      {},
      {
        params: { id: requestId },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
  }

  cancelRequest(requestId: number, token: string): Promise<boolean> {
    return this.api.post('cancelRequest', requestId, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json-patch+json'
      }
    })
  }

  getCancellationMessage(
    requestId: number,
    language: LanguageName,
    token: string
  ): Promise<string> {
    return this.api.get('getCancelationMessage', {
      params: { requestId, language },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  getUserRequests(token: string): Promise<RequestEntity[]> {
    return this.api.get('getUserRequests', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  createRequest(input: CreateRequestInput, token: string): Promise<number> {
    return this.api.post('createRequest', input, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  updateRequest(input: UpdateRequestInput, token: string): Promise<boolean> {
    return this.api.post('updateRequest', input, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
}
