import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { type FlightEntity, packageUseCases } from '@entities/package'
import { type GetAvailableFlightsParams } from '@entities/package'
import { FLIGHT_REQUEST_REFETCH_INTERVAL } from '@shared/configs'

export const useAvailableFlights = (
  params: GetAvailableFlightsParams,
  options?: Omit<UseQueryOptions<FlightEntity[]>, 'queryKey' | 'queryFn'>
) =>
  useQuery({
    ...(options || {}),
    refetchInterval: FLIGHT_REQUEST_REFETCH_INTERVAL,
    queryFn: () => packageUseCases.getAvailableFlights(params),
    queryKey: ['available-flights', params]
  })
