import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { useUserContext } from '@entities/user'
import {
  userReviewsService,
  type UploadedUserReviewMedia
} from '../api/userReviewsService'

type UploadUserReviewMediaPayload = {
  hotelId: number
  mediaType: number
  file: File
}

export const useUploadUserReviewMedia = (
  options?: UseMutationOptions<
    UploadedUserReviewMedia,
    unknown,
    UploadUserReviewMediaPayload
  >
) => {
  const { userToken } = useUserContext()

  return useMutation({
    mutationKey: ['upload-user-review-media'],
    mutationFn: payload => userReviewsService.uploadMedia(payload, userToken),
    ...options
  })
}
