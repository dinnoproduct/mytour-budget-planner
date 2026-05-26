import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { useUserContext } from '@entities/user'
import {
  userReviewsService,
  type UploadedUserReviewMedia
} from '../api/UserReviewsService'

type UploadUserReviewMediaPayload = {
  hotelId: number
  mediaType: number
  file: File
  fileName?: string
  contentType?: string
  totalSize?: number
  totalChunks?: number
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
