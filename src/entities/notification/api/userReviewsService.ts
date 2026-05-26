import axios, { type AxiosInstance } from 'axios'

export interface UserReviewMediaType {
  id: number
  name: string
}

export interface UploadedUserReviewMedia {
  hotelId: number
  url: string
}

type InitUserReviewMediaPayload = {
  hotelId: number
  mediaType: number
  fileName: string
  contentType: string
  totalSize: number
  totalChunks: number
}

type InitUserReviewMediaResponse = {
  sessionId: string
}

const INVALID_UPLOAD_RESPONSE_ERROR = 'UPLOAD_MEDIA_FAILED'

const unwrapAxiosData = <T>(response: T | { data: T }): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as { data: T }).data
  }

  return response as T
}

export interface UserReviewRatings {
  location: number
  cleanliness: number
  food: number
}

export interface UserReviewMediaFile {
  url: string
  mediaType: number
}

export interface CreateHotelReviewPayload {
  hotelId: number
  reviewDescription: string
  ratings: UserReviewRatings
  mediaFiles: UserReviewMediaFile[]
}

export interface HotelReview {
  id: number
  hotelId: number
  leadId: number
  reviewDescription: string
  firstName: string
  lastName: string
  ratings: UserReviewRatings
  mediaFiles: UserReviewMediaFile[]
  reviewDate: Date | string
}

export interface HotelReviewsPagination {
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export interface HotelReviewsAverageRatings extends UserReviewRatings {
  total: number
}

export interface HotelReviewsResponse {
  reviews: HotelReview[]
  pagination: HotelReviewsPagination
  averageRatings: HotelReviewsAverageRatings
}

export class UserReviewsService {
  private readonly api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_URL}/v2/userreviews`
    })

    this.api.interceptors.response.use(
      response => response.data,
      error => Promise.reject(error)
    )
  }

  getMediaTypes(): Promise<UserReviewMediaType[]> {
    return this.api.get('/mediatypes')
  }

  uploadMedia(
    payload: {
      hotelId: number
      mediaType: number
      file: File
      fileName?: string
      contentType?: string
      totalSize?: number
      totalChunks?: number
    },
    token: string
  ): Promise<UploadedUserReviewMedia> {
    if (payload.mediaType === 2) {
      return this.uploadVideoMedia(payload, token)
    }

    const formData = new FormData()
    formData.append('hotelId', String(payload.hotelId))
    formData.append('MediaType', String(payload.mediaType))
    formData.append('File', payload.file)

    return this.api.post('/media', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  private async uploadVideoMedia(
    payload: {
      hotelId: number
      mediaType: number
      file: File
      fileName?: string
      contentType?: string
      totalSize?: number
      totalChunks?: number
    },
    token: string
  ): Promise<UploadedUserReviewMedia> {
    const initPayload: InitUserReviewMediaPayload = {
      hotelId: payload.hotelId,
      mediaType: 2,
      fileName: payload.fileName ?? payload.file.name,
      contentType: payload.contentType ?? payload.file.type,
      totalSize: payload.totalSize ?? payload.file.size,
      totalChunks: payload.totalChunks ?? 1
    }

    const initResponseRaw = await this.api.post<InitUserReviewMediaResponse>(
      '/media/init',
      initPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    const initResponse = unwrapAxiosData<InitUserReviewMediaResponse>(initResponseRaw)
    const sessionId = initResponse?.sessionId

    if (!sessionId) {
      throw new Error(INVALID_UPLOAD_RESPONSE_ERROR)
    }

    const chunkFormData = new FormData()
    chunkFormData.append('SessionId', sessionId)
    chunkFormData.append('ChunkIndex', '0')
    chunkFormData.append('Chunk', payload.file)

    await this.api.post('/media/chunk', chunkFormData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })

    const mediaCompleteResponseRaw = await this.api.post<UploadedUserReviewMedia>(
      '/media/complete',
      { sessionId },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    const uploadedMedia = unwrapAxiosData<UploadedUserReviewMedia>(mediaCompleteResponseRaw)

    if (!uploadedMedia?.url) {
      throw new Error(INVALID_UPLOAD_RESPONSE_ERROR)
    }

    return uploadedMedia
  }

  createHotelReview(
    payload: CreateHotelReviewPayload,
    token: string
  ): Promise<number> {
    return this.api.post('/createhotelreview', payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  getHotelReviews(hotelId: number): Promise<HotelReviewsResponse> {
    return this.api.get('/gethotelreviews', {
      params: { hotelId }
    })
  }
}

export const userReviewsService = new UserReviewsService()
