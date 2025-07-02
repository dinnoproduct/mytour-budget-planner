import {
  useMutation,
  type UseMutationResult
} from '@tanstack/react-query'
import {
  packageUseCases,
  type PrepaymentCalculationParams,
  type PrepaymentInfo
} from '@entities/package'

export const useCalculatePrepayment = (): UseMutationResult<
  PrepaymentInfo,
  Error,
  PrepaymentCalculationParams
> =>
  useMutation({
    mutationFn: (params: PrepaymentCalculationParams) =>
      packageUseCases.calculatePrepayment(params)
  })
