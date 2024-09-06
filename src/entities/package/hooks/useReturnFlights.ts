import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { FlightEntity, GetReturnFlightsParams, packageUseCases } from '@entities/package'
import { FLIGHT_REQUEST_REFETCH_INTERVAL } from '@shared/configs'

export const useReturnFlights = (
	params: GetReturnFlightsParams,
	options?: Omit<UseQueryOptions<FlightEntity[]>, 'queryKey' | 'queryFn'>
) => {
	return useQuery({
		...(options || {}),
		refetchInterval: FLIGHT_REQUEST_REFETCH_INTERVAL,
		queryFn: () => packageUseCases.getReturnFlights(params),
		queryKey: ['return-flights', params],
	})
}