import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import {
  userReviewsService,
  type UserReviewMediaType
} from '../api/userReviewsService'

export const useUserReviewMediaTypes = (
  options?: Omit<UseQueryOptions<UserReviewMediaType[]>, 'queryKey' | 'queryFn'>
) =>
  useQuery({
    ...options,
    queryKey: ['user-review-media-types'],
    queryFn: () => userReviewsService.getMediaTypes()
  })
