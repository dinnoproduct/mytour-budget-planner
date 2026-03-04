import { useQuery } from '@tanstack/react-query'
import { packageUseCases, type PaymentSystemInfo } from '@entities/package'
import { useUserContext } from '@entities/user'

export const usePaymentSystems = (travelAgencyId?: number | null) => {
  const { userToken } = useUserContext()

  return useQuery<PaymentSystemInfo[]>({
    queryKey: ['paymentSystems', travelAgencyId, userToken],
    enabled: !!travelAgencyId && !!userToken,
    queryFn: () =>
      packageUseCases.getPaymentSystems(travelAgencyId as number, userToken),
  })
}

