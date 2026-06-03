import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { visaRequestService } from '../api/VisaRequestService'
import {
  type CreateVisaRequestPayload,
  type CreateVisaRequestResponse,
} from '../model/visaRequest'

type CreateVisaRequestVariables = {
  payload: CreateVisaRequestPayload
  token: string
}

export const useCreateVisaRequest = (
  options?: UseMutationOptions<
    CreateVisaRequestResponse,
    unknown,
    CreateVisaRequestVariables
  >,
) =>
  useMutation({
    mutationKey: ['create-visa-request'],
    mutationFn: async ({ payload, token }) => {
      if (!token) {
        throw new Error('visa_request_unauthorized')
      }

      return visaRequestService.createVisaRequest(payload, token)
    },
    ...options,
  })
