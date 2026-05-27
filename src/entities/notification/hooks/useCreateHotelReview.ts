import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { useUserContext } from '@entities/user'
import {
  userReviewsService,
  type CreateHotelReviewPayload
} from '../api/UserReviewsService'

export const useCreateHotelReview = (
  options?: UseMutationOptions<number, unknown, CreateHotelReviewPayload>
) => {
  const { userToken } = useUserContext()

  return useMutation({
    mutationKey: ['create-hotel-review'],
    mutationFn: payload => userReviewsService.createHotelReview(payload, userToken),
    ...options
  })
}
