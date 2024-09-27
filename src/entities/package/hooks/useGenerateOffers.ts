import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { GenerateOffersInput, OfferEntity, packageUseCases } from '@entities/package'

export const useGenerateOffers = (
	input: GenerateOffersInput,
	options?: Omit<UseQueryOptions<OfferEntity[]>, 'queryKey' | 'queryFn'>
) => {
	return useQuery({
		queryFn: () => packageUseCases.generateOffers(input),
		queryKey: ['generate-offers', input],
		...(options || {})
	})
}