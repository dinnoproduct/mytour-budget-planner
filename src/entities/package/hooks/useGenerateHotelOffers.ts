import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import {
  type GenerateHotelOffersInput,
  type OfferEntity,
  packageUseCases
} from '@entities/package'
import moment from 'moment'

const toQueryKeyDate = (value: string) => {
  const parsed = moment(value, moment.ISO_8601, true)
  return parsed.isValid() ? parsed.format('ddd MMM DD YYYY') : ''
}

export const useGenerateHotelOffers = (
  input: GenerateHotelOffersInput,
  options?: Omit<UseQueryOptions<OfferEntity[]>, 'queryKey' | 'queryFn'>
) =>
  useQuery({
    queryFn: () => packageUseCases.generateHotelOffers(input),
    queryKey: [
      'generate-hotel-offers',
      input.hotelId,
      toQueryKeyDate(input.checkin),
      toQueryKeyDate(input.checkout),
      input.adults,
      input.childs,
      input.travelAgency
    ],
    ...(options || {})
  })
