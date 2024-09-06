import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import { PackageEntity, useSearchPackages } from '@entities/package'
import { PACKAGE_REQUEST_REFETCH_INTERVAL } from '@shared/configs'
import { EmptyObject } from 'react-hook-form'

export const useSearchPackage = (
	options?: Omit<UseQueryOptions<PackageEntity[]>, 'queryKey' | 'queryFn'>
) => {
	const location = useLocation()

	const searchParams = new URLSearchParams(location.search)
	const searchData = {
		flightId: parseInt(searchParams.get('departureFlightId') || '0', 10),
		returnFlightId: parseInt(searchParams.get('returnFlightId') || '0', 10),
		city: parseInt(searchParams.get('city') || '0', 10),
		adults: parseInt(searchParams.get('adultsCount') || '0', 10),
		childs: searchParams.get('childrenAges')
			? searchParams.get('childrenAges')!.split(',').map(age => parseInt(age, 10)).filter(age => !isNaN(age))
			: []
	}

	const { data: packages, isLoading } = useSearchPackages(searchData, {
		refetchInterval: PACKAGE_REQUEST_REFETCH_INTERVAL,
		...options
	})

	const hotelId = parseInt(searchParams.get('hotelId') || '0', 10)
	const roomId = parseInt(searchParams.get('roomId') || '0', 10)

	const packageDetails: PackageEntity | EmptyObject = packages?.find(pkg =>
		pkg.hotel.id === hotelId && pkg.roomType === roomId
	) || {}

	return { packageDetails, isLoading }
}