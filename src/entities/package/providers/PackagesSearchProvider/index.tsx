import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import moment from 'moment'
import { type SearchContextType, type SearchData } from './types'
import {
  type PackageEntity,
  useAvailableFlights,
  useCities,
  usePackageList,
  useReturnFlights,
  useSearchPackagesAsync
} from '@entities/package'

const LOCAL_STORAGE_KEY = 'package_search_params'

const defaultSearchData: SearchData = {
  fromDate: null,
  toDate: null,
  selectedCity: 0,
  travelersData: {
    adultsCount: 2,
    childrenCount: 0,
    childrenAges: []
  },
  departureFlightId: null,
  returnFlightId: null
}

const ALLOWED_SEARCH_ROUTES = [
  { path: '/packages', query: [['tab', 'packages']] }
]

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export const PackagesSearchProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [isCityChanged, setIsCityChanged] = useState(false)
  const [isDefaultSearchDone, setIsDefaultSearchDone] = useState(false)
  useState(false)
  const { data: cities = [] } = useCities()

  const isAllowedSearchRoute = useMemo(() => {
    const isAllowed = ALLOWED_SEARCH_ROUTES.some(route => {
      if (route.path === location.pathname) {
        if (route.query.length === 0) {
          return true
        }

        return route.query.every(query => {
          const value = searchParams.get(query[0])

          return value && value === query[1]
        })
      }

      return false
    })

    return isAllowed
  }, [location.pathname, searchParams])

  const { data: packageList = [] } = usePackageList({
    enabled: isAllowedSearchRoute
  })
  const [filteredPackages, setFilteredPackages] = useState<PackageEntity[]>([])
  const [isLoadingFilteredPackages, setIsLoadingFilteredPackages] =
    useState(false)
  const [isSearchError, setIsSearchError] = useState(false)
  const searchPackagesAsync = useSearchPackagesAsync()
  const [searchData, setSearchDataState] =
    useState<SearchData>(defaultSearchData)
  const [availableDepartureDates, setAvailableDepartureDates] = useState<
    Date[]
  >([])
  const [availableReturnDates, setAvailableReturnDates] = useState<Date[]>([])

  const saveSearchDataToLocalStorage = (data: SearchData) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data))
  }

  // Function to load searchData from localStorage
  const loadSearchDataFromLocalStorage = (): SearchData | null => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY)

    return savedData ? JSON.parse(savedData) : null
  }

  // set default search data
  useEffect(() => {
    // if search data is already set, do nothing
    if (searchData.fromDate && searchData.toDate) {
      return
    }

    const savedSearchData = loadSearchDataFromLocalStorage()
    const fromDate = savedSearchData?.fromDate
      ? moment(savedSearchData?.fromDate)
      : null
    const today = moment().startOf('day')

    let updatedSearchData = { ...searchData }

    if (!updatedSearchData.selectedCity && cities[0]?.id) {
      updatedSearchData.selectedCity = cities[0]?.id
    }

    if (
      savedSearchData?.fromDate &&
      savedSearchData?.toDate &&
      savedSearchData?.departureFlightId &&
      savedSearchData?.returnFlightId &&
      fromDate &&
      fromDate.isSameOrAfter(today) &&
      savedSearchData.selectedCity
    ) {
      updatedSearchData = {
        ...updatedSearchData,
        ...savedSearchData,
        fromDate: new Date(savedSearchData.fromDate),
        toDate: new Date(savedSearchData.toDate)
      }
    }
    // set search data from default packages
    else {
      const packageItem = packageList?.[0]

      if (
        packageItem?.offerId &&
        !searchData.fromDate &&
        !searchData.toDate &&
        !searchData.departureFlightId &&
        !searchData.returnFlightId
      ) {
        updatedSearchData = {
          ...updatedSearchData,
          fromDate: new Date(packageItem.destinationFlight.departureDate),
          toDate: new Date(packageItem.returnFlight.arrivalDate),
          departureFlightId: packageItem.destinationFlight.id,
          returnFlightId: packageItem.returnFlight.id,
          selectedCity: packageItem.city.id
        }
      }
    }

    setSearchData(updatedSearchData, true)
  }, [JSON.stringify(packageList), cities])

  const { data: departureFlights } = useAvailableFlights({
    city: searchData.selectedCity
  })
  const { data: returnFlights, isLoading: isLoadingReturnFlights } =
    useReturnFlights(
      {
        flightId: searchData.departureFlightId as number
      },
      {
        enabled: !!searchData.departureFlightId
      }
    )

  useEffect(() => {
    if (Array.isArray(departureFlights)) {
      const dates = departureFlights.map(
        flight => new Date(flight.departureDate)
      )
      setAvailableDepartureDates(dates)

      // set first flight on city change
      if (isCityChanged) {
        setSearchData({
          departureFlightId: departureFlights[0].id
        })
      }
    }
  }, [departureFlights])

  useEffect(() => {
    if (returnFlights) {
      const dates = returnFlights.map(flight => new Date(flight.arrivalDate))
      setAvailableReturnDates(dates)

      if (isCityChanged && departureFlights) {
        const packageItem = packageList?.[0]

        if (returnFlights[0]) {
          setSearchData({
            returnFlightId: returnFlights[0].id,
            toDate: dates[0],
            fromDate: new Date(departureFlights[0].departureDate)
          })
        } else if (
          packageItem &&
          searchData.selectedCity === packageItem.city.id
        ) {
          setSearchData({
            departureFlightId: packageItem.destinationFlight.id,
            returnFlightId: packageItem.returnFlight.id,
            toDate: new Date(packageItem.returnFlight.arrivalDate),
            fromDate: new Date(packageItem.destinationFlight.departureDate)
          })
        }

        setIsCityChanged(false)
      }
    }
  }, [JSON.stringify(returnFlights)])

  useEffect(() => {
    const selectedFlight = returnFlights?.find(flight =>
      moment(flight.arrivalDate).isSame(searchData.toDate, 'day')
    )

    if (selectedFlight) {
      setSearchData({
        returnFlightId: selectedFlight.id
      })
    }
  }, [searchData.toDate])

  const handleFromDateClick = (date: Date) => {
    const selectedFlight = departureFlights?.find(flight =>
      moment(flight.departureDate).isSame(date, 'day')
    )

    if (selectedFlight) {
      setSearchData({
        departureFlightId: selectedFlight.id
      })
    }
  }

  const generateSearchQueryParams = (searchData: SearchData) => {
    const formatDate = (date: Date | null) =>
      date ? moment(date).format('YYYY-MM-DD') : ''

    const queryParams = new URLSearchParams({
      from: formatDate(searchData.fromDate),
      to: formatDate(searchData.toDate),
      city: searchData.selectedCity + '',
      adultsCount: searchData.travelersData.adultsCount.toString(),
      childrenCount: searchData.travelersData.childrenCount.toString(),
      childrenAges: searchData.travelersData.childrenAges.join(','),
      departureFlightId: searchData.departureFlightId?.toString() || '',
      returnFlightId: searchData.returnFlightId?.toString() || '',
      tab: 'packages'
    })

    return queryParams
  }

  const handleSearch = async (searchData: SearchData) => {
    try {
      setIsSearchError(false)
      const {
        fromDate,
        toDate,
        selectedCity,
        travelersData,
        departureFlightId,
        returnFlightId
      } = searchData
      const queryParams = generateSearchQueryParams(searchData)
      navigate(`/packages?${queryParams.toString()}`)

      setIsLoadingFilteredPackages(true)
      saveSearchDataToLocalStorage(searchData)

      const searchPackagesResponse = await searchPackagesAsync({
        dateFrom: moment(fromDate).format('YYYY-MM-DD'),
        dateTo: moment(toDate).format('YYYY-MM-DD'),
        cities: [selectedCity],
        adults: travelersData.adultsCount,
        childs: travelersData.childrenAges,
        // nightsCorrectionLowerValue: 0,
        // nightsCorrectionUpperValue: 0,
        lateCheckout: false,
        bookingType: 1
      })
      setFilteredPackages(searchPackagesResponse)
    } catch (error) {
      setIsSearchError(true)
    } finally {
      setIsLoadingFilteredPackages(false)
    }
  }

  const setSearchData = (
    data: Partial<SearchData>,
    isDefaultData?: boolean
  ) => {
    if (!isDefaultData && data.selectedCity) {
      setIsCityChanged(true)
    }

    setSearchDataState(prevData => ({ ...prevData, ...data }))
  }

  const navigateToDefaultSearch = () => {
    const queryParams = generateSearchQueryParams(searchData)
    navigate(`/packages?${queryParams.toString()}`)
  }

  useEffect(() => {
    if (
      isAllowedSearchRoute &&
      searchData.departureFlightId &&
      searchData.returnFlightId &&
      filteredPackages.length === 0 &&
      !isDefaultSearchDone
    ) {
      handleSearch(searchData)
      setIsDefaultSearchDone(true)
    }
  }, [
    searchData.departureFlightId,
    searchData.returnFlightId,
    filteredPackages.length,
    isAllowedSearchRoute
  ])

  useEffect(() => {
    if (!isAllowedSearchRoute) {
      return
    }

    const getDateFromParam = (param: string | null) =>
      param ? new Date(param) : null

    const currentData = {} as SearchData

    const fromParam = searchParams.get('from')
    const toParam = searchParams.get('to')
    const cityParam = searchParams.get('city')
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

    if (cityParam) {
      currentData.selectedCity = parseInt(cityParam, 10)
    }

    if (childrenCountParam || childrenAgesParam || adultsCountParam) {
      currentData.travelersData = {
        adultsCount: parseInt(adultsCountParam || '0', 10),
        childrenCount: parseInt(childrenCountParam || '0', 10),
        childrenAges:
          (childrenAgesParam || '').split(',').filter(Boolean).map(Number) || []
      }
    }

    if (departureFlightIdParam) {
      currentData.departureFlightId = parseInt(departureFlightIdParam, 10)
    }

    if (returnFlightIdParam) {
      currentData.returnFlightId = parseInt(returnFlightIdParam, 10)
    }

    setSearchData(currentData, true)
  }, [searchParams, isAllowedSearchRoute])

  return (
    <SearchContext.Provider
      value={{
        searchData,
        handleSearch,
        setSearchData,
        availableDepartureDates,
        availableReturnDates,
        isLoadingReturnDates: isLoadingReturnFlights,
        handleFromDateClick,
        filteredPackages,
        isLoadingFilteredPackages,
        isSearchError,
        generateSearchQueryParams,
        isAllowedSearchRoute,
        navigateToDefaultSearch,
        cities
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export const usePackagesSearchContext = () => {
  const context = useContext(SearchContext)

  if (!context) {
    throw new Error(
      'useSearchContext must be used within a PackagesSearchProvider'
    )
  }

  return context
}
