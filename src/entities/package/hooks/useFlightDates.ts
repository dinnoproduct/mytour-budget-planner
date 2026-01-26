import { useQuery, type UseQueryOptions, type QueryKey } from '@tanstack/react-query'
import { packageUseCases, type FlightDates } from '@entities/package'
import { PACKAGE_REQUEST_REFETCH_INTERVAL } from '@shared/configs'

const DEFAULT_PARAMS = {
  travelAgencyId: 4,
  destinationId: 1,
  daysCountFromNow: 50,
  duration: 6,
} as const

export const useFlightDates = (
  options?: Omit<
    UseQueryOptions<FlightDates, unknown, FlightDates, QueryKey>,
    'queryFn' | 'queryKey'
  >
) => {
  return useQuery<FlightDates, unknown, FlightDates, QueryKey>({
    queryKey: ['flightDates', DEFAULT_PARAMS] as const,
    queryFn: () => packageUseCases.flightDatesSearch(DEFAULT_PARAMS),
    refetchInterval:
      typeof PACKAGE_REQUEST_REFETCH_INTERVAL === 'number'
        ? PACKAGE_REQUEST_REFETCH_INTERVAL
        : false,
    ...(options ?? {}),
  })
}
