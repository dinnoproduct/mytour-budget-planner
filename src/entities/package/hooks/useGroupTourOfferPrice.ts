import { useQuery } from '@tanstack/react-query'
import { packageUseCases, type CreateGroupTourOfferInput, type GroupTourOfferPrice } from '@entities/package'

type UseGroupTourOfferPriceParams = CreateGroupTourOfferInput | null

export const useGroupTourOfferPrice = (params: UseGroupTourOfferPriceParams) => {
  return useQuery<GroupTourOfferPrice>({
    queryKey: ['groupTourOfferPrice', params],
    enabled: !!params?.tourId,
    queryFn: () => packageUseCases.createGroupTourOffer(params as CreateGroupTourOfferInput),
  })
}

