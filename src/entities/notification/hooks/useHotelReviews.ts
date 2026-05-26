import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import {
  userReviewsService,
  type HotelReviewsResponse
} from '../api/UserReviewsService'

export const useHotelReviews = (
  hotelId?: number,
  options?: Omit<UseQueryOptions<HotelReviewsResponse>, 'queryKey' | 'queryFn'>
) =>
  useQuery({
    ...options,
    queryKey: ['hotel-reviews', hotelId],
    enabled: !!hotelId && (options?.enabled ?? true),
    queryFn: () => userReviewsService.getHotelReviews(hotelId as number)
  })
