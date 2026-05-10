import axios, { type AxiosInstance } from 'axios'

export interface UserReviewMediaType {
  id: number
  name: string
}

export interface UploadedUserReviewMedia {
  hotelId: number
  url: string
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
    payload: { hotelId: number; mediaType: number; file: File },
    token: string
  ): Promise<UploadedUserReviewMedia> {
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
