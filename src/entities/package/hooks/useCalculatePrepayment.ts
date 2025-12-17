import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import {
  packageUseCases,
  type PrepaymentCalculationParams,
  type PrepaymentInfo
} from '@entities/package'

export const useCalculatePrepayment = (
  params: PrepaymentCalculationParams,
  options?: { enabled?: boolean }
): UseQueryResult<PrepaymentInfo> => {
  const queryKey = ['calculatePrepayment', JSON.stringify(params)]

  return useQuery({
    queryKey,
    queryFn: () => packageUseCases.calculatePrepayment(params),
    ...options
  })
}
