import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import {
  type GenerateHotelOffersInput,
  type OfferEntity,
  packageUseCases
} from '@entities/package'
import moment from 'moment'

export const useGenerateHotelOffers = (
  input: GenerateHotelOffersInput,
  options?: Omit<UseQueryOptions<OfferEntity[]>, 'queryKey' | 'queryFn'>
) =>
  useQuery({
    queryFn: () => packageUseCases.generateHotelOffers(input),
    queryKey: [
      'generate-hotel-offers',
      input.hotelId,
      moment(input.checkin).format('ddd MMM DD YYYY'),
      moment(input.checkout).format('ddd MMM DD YYYY'),
      input.adults,
      input.childs,
      input.travelAgency
    ],
    ...(options || {})
  })
