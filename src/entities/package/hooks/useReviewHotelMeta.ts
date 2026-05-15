import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import {
  packageUseCases,
  type PackageCity,
  type PackageHotel
} from '@entities/package'

export type ReviewHotelMeta = {
  hotelImageUrl: string
  hotelName: string
  hotelLocation: string
}

type ReviewHotelApiResponse = PackageHotel & { city: PackageCity }

const normalizeReviewHotelMeta = (
  data?: ReviewHotelApiResponse
): ReviewHotelMeta => {
  if (!data) {
    return {
      hotelImageUrl: '',
      hotelName: '',
      hotelLocation: ''
    }
  }

  const hotelImageUrl = data.images?.[0]?.url ?? ''
  const hotelName = data.name ?? ''
  const city = data.city?.nameEng ?? ''
  const country = data.city?.country?.nameEng ?? ''

  return {
    hotelImageUrl,
    hotelName,
    hotelLocation: [city, country].filter(Boolean).join(', ')
  }
}

export const useReviewHotelMeta = (
  {
    id
  }: {
    id: number
  },
  options?: Omit<UseQueryOptions<ReviewHotelMeta>, 'queryFn' | 'queryKey'>
) =>
  useQuery({
    ...(options || {}),
    queryKey: ['review-hotel-meta', id],
    enabled: !!id,
    queryFn: async () => {
      const response = await packageUseCases.getReviewHotelMeta(id)
      return normalizeReviewHotelMeta(response)
    }
  })
