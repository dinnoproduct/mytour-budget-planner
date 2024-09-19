import React, { createContext, useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import moment from 'moment'
import { SearchContextType, SearchData } from './types'
import {
	CITIES, PackageEntity,
	useAvailableFlights,
	usePackageList,
	useReturnFlights,
	useSearchPackagesAsync
} from '@entities/package'

const defaultSearchData: SearchData = {
	fromDate: null,
	toDate: null,
	selectedCities: [CITIES[0].id],
	travelersData: {
		adultsCount: 2,
		childrenCount: 0,
		childrenAges: []
	},
	departureFlightId: null,
	returnFlightId: null,
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export const PackagesSearchProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
	const navigate = useNavigate()
	const location = useLocation()
	const [searchParams] = useSearchParams()
	const { data: packageList = [] } = usePackageList()
	const [filteredPackages, setFilteredPackages] = useState<PackageEntity[]>([])
	const [isLoadingFilteredPackages, setIsLoadingFilteredPackages] = useState(false)
	const searchPackagesAsync = useSearchPackagesAsync()
	const [searchData, setSearchDataState] = useState<SearchData>(defaultSearchData)
	const [availableDepartureDates, setAvailableDepartureDates] = useState<Date[]>([])
	const [availableReturnDates, setAvailableReturnDates] = useState<Date[]>([])

	useEffect(() => {
		const packageItem = packageList?.[0]
			if (packageItem?.offerId && !searchData.fromDate && !searchData.toDate && !searchData.departureFlightId && !searchData.returnFlightId) {
				setSearchData({
					fromDate: new Date(packageItem.destinationFlight.departureDate),
					toDate: new Date(packageItem.returnFlight.arrivalDate),
					departureFlightId: packageItem.destinationFlight.id,
					returnFlightId: packageItem.returnFlight.id
				})
		}
	}, [packageList?.length, searchData])

	const { data: departureFlights } = useAvailableFlights({ city: 1 })
	const {
		data: returnFlights,
		isLoading: isLoadingReturnFlights
	} = useReturnFlights({
		flightId: searchData.departureFlightId as number
	}, {
		enabled: !!searchData.departureFlightId
	})

	useEffect(() => {
		if (departureFlights) {
			const dates = departureFlights.map(flight => new Date(flight.departureDate))
			setAvailableDepartureDates(dates)
		}
	}, [departureFlights])

	useEffect(() => {
		if (returnFlights) {
			const dates = returnFlights.map(flight => new Date(flight.arrivalDate))
			setAvailableReturnDates(dates)
		}
	}, [JSON.stringify(returnFlights)])

	useEffect(() => {
		const selectedFlight = returnFlights?.find(flight => moment(flight.arrivalDate).isSame(searchData.toDate, 'day'))

		if (selectedFlight) {
			setSearchData({
				returnFlightId: selectedFlight.id
			})
		}
	}, [searchData.toDate])

	const handleFromDateClick = (date: Date) => {
		const selectedFlight = departureFlights?.find(flight => moment(flight.departureDate).isSame(date, 'day'))

		if (selectedFlight) {
			setSearchData({
				departureFlightId: selectedFlight.id
			})
		}
	}

	const generateSearchQueryParams = (searchData: SearchData) => {
		const formatDate = (date: Date | null) => date ? moment(date).format('YYYY-MM-DD') : ''

		const queryParams = new URLSearchParams({
			from: formatDate(searchData.fromDate),
			to: formatDate(searchData.toDate),
			cities: searchData.selectedCities.join(','),
			adultsCount: searchData.travelersData.adultsCount.toString(),
			childrenCount: searchData.travelersData.childrenCount.toString(),
			childrenAges: searchData.travelersData.childrenAges.join(','),
			departureFlightId: searchData.departureFlightId?.toString() || '',
			returnFlightId: searchData.returnFlightId?.toString() || '',
		})

		return queryParams
	}

	const handleSearch = async (searchData: SearchData) => {
		const {
			fromDate,
			toDate,
			selectedCities,
			travelersData,
			departureFlightId,
			returnFlightId
		} = searchData
		const queryParams = generateSearchQueryParams(searchData)
		navigate(`/packages?${queryParams.toString()}`)

		setIsLoadingFilteredPackages(true)
		const searchPackagesResponse = await searchPackagesAsync({
			flightId: departureFlightId as number,
			returnFlightId: returnFlightId as number,
			city: 1,
			adults: travelersData.adultsCount,
			childs: travelersData.childrenAges
		})
		setFilteredPackages(searchPackagesResponse)
		setIsLoadingFilteredPackages(false)
	}

	const setSearchData = (data: Partial<SearchData>) => {
		setSearchDataState(prevData => ({ ...prevData, ...data }))
	}

	useEffect(() => {
		if (
			location.pathname === '/packages'
			&& searchData.departureFlightId
			&& searchData.returnFlightId
			&& filteredPackages.length === 0
		) {
			handleSearch(searchData)
		}
	}, [searchData.departureFlightId, searchData.returnFlightId, filteredPackages.length])

	useEffect(() => {
		const getDateFromParam = (param: string | null) => param ? new Date(param) : null

		const currentData = { ...searchData }

		const fromParam = searchParams.get('from')
		const toParam = searchParams.get('to')
		const citiesParam = searchParams.get('cities')
		const adultsCountParam = searchParams.get('adultsCount')
		const childrenCountParam = searchParams.get('childrenCount')
		const childrenAgesParam = searchParams.get('childrenAges')
		const departureFlightIdParam = searchParams.get('departureFlightId')
		const returnFlightIdParam = searchParams.get('returnFlightId')

		if (fromParam) {
			currentData.fromDate = getDateFromParam(fromParam)
		}
		if (toParam) {
			currentData.toDate = getDateFromParam(toParam)
		}
		if (citiesParam) {
			currentData.selectedCities = citiesParam.split(',').map(city => parseInt(city, 10))
		}
		if (adultsCountParam) {
			currentData.travelersData.adultsCount = parseInt(adultsCountParam, 10)
		}
		if (childrenCountParam) {
			currentData.travelersData.childrenCount = parseInt(childrenCountParam, 10)
		}
		if (childrenAgesParam) {
			currentData.travelersData.childrenAges = childrenAgesParam.split(',').map(age => parseInt(age, 10))
		}
		if (departureFlightIdParam) {
			currentData.departureFlightId = (parseInt(departureFlightIdParam, 10))
		}
		if (returnFlightIdParam) {
			currentData.returnFlightId = (parseInt(returnFlightIdParam, 10))
		}

		setSearchData(currentData)
	}, [searchParams])

	return (
		<SearchContext.Provider value={{
			searchData,
			handleSearch,
			setSearchData,
			availableDepartureDates,
			availableReturnDates,
			isLoadingReturnDates: isLoadingReturnFlights,
			handleFromDateClick,
			filteredPackages,
			isLoadingFilteredPackages,
			generateSearchQueryParams
		}}>
			{children}
		</SearchContext.Provider>
	)
}

export const usePackagesSearchContext = () => {
	const context = useContext(SearchContext)
	if (!context) {
		throw new Error('useSearchContext must be used within a PackagesSearchProvider')
	}
	return context
}