import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { FlightEntity, packageUseCases } from '@entities/package'
import { GetAvailableFlightsParams } from '@entities/package'
import { FLIGHT_REQUEST_REFETCH_INTERVAL } from '@shared/configs'

export const useAvailableFlights = (
	params: GetAvailableFlightsParams,
	options?: UseQueryOptions<FlightEntity[]>
) => {
	return useQuery({
		...(options || {}),
		refetchInterval: FLIGHT_REQUEST_REFETCH_INTERVAL,
		queryFn: () => packageUseCases.getAvailableFlights(params),
		queryKey: ['available-flights', params]
	})
}