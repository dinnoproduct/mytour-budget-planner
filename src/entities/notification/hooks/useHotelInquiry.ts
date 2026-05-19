import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import {
  hotelInquiriesService,
  type HotelInquiryPayload,
  type HotelInquiryResponse,
} from '../api/HotelInquiriesService'

export const useHotelInquiry = (
  options?: UseMutationOptions<HotelInquiryResponse, unknown, HotelInquiryPayload>,
) => {
  return useMutation({
    mutationKey: ['hotel-inquiry'],
    mutationFn: async (payload: HotelInquiryPayload) => {
      const response = await hotelInquiriesService.createInquiry(payload)
      if (response?.success === false) {
        throw new Error('hotel_inquiry_failed')
      }
      return response
    },
    ...options,
  })
}
