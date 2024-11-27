import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import {
  type GenerateHotelOffersInput,
  type OfferEntity,
  packageUseCases
} from '@entities/package'

export const useGenerateHotelOffers = (
  input: GenerateHotelOffersInput,
  options?: Omit<UseQueryOptions<OfferEntity[]>, 'queryKey' | 'queryFn'>
) =>
  useQuery({
    queryFn: () => packageUseCases.generateHotelOffers(input),
    queryKey: ['generate-hotel-offers', input],
    ...(options || {})
  })
