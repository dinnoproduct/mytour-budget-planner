import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import {
  type GenerateOffersInput,
  type OfferEntity,
  packageUseCases
} from '@entities/package'

export const useGenerateOffers = (
  input: GenerateOffersInput,
  options?: GenerateOffersOptions
) =>
  useQuery({
    queryFn: () => packageUseCases.generateOffers(input),
    queryKey: ['generate-offers', input],
    ...(options || {})
  })

export type GenerateOffersOptions = Omit<
  UseQueryOptions<OfferEntity[]>,
  'queryKey' | 'queryFn'
>
