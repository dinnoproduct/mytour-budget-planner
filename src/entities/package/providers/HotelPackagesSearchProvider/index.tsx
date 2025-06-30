import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import moment from 'moment'
import {
  type DateModeType,
  type SearchContextType,
  type SearchData
} from './types'
import {
  type PackageEntity,
  useCitiesOnlyHotel,
  useSearchHotelPackagesAsync
} from '@entities/package'

const LOCAL_STORAGE_KEY = 'hotel_packages_search_params'

const defaultSearchData: SearchData = {
  fromDate: null,
  toDate: null,
  selectedCity: 0,
  travelersData: {
    adultsCount: 2,
    childrenCount: 0,
    childrenAges: []
  }
}

const ALLOWED_SEARCH_ROUTES = [{ path: '/packages', query: [['tab', 'hotel']] }]

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export const HotelPackagesSearchProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [isLoadingFilteredHotelPackages, setIsLoadingFilteredHotelPackages] =
    useState(false)
  const [isSearchError, setIsSearchError] = useState(false)
  const [dateMode, setDateMode] = useState<DateModeType>('exact')
  const [filteredHotelPackages, setFilteredHotelPackages] = useState<
    PackageEntity[]
  >([])
  const { data: cities = [] } = useCitiesOnlyHotel()
  const searchHotelsAsync = useSearchHotelPackagesAsync()
  const [searchData, setSearchDataState] =
    useState<SearchData>(defaultSearchData)

  const saveSearchDataToLocalStorage = (data: SearchData) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data))
  }

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

  // Function to load searchData from localStorage
  const loadSearchDataFromLocalStorage = (): SearchData | null => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY)

    return savedData ? JSON.parse(savedData) : null
  }

  useEffect(() => {
    if (searchData.fromDate && searchData.toDate) {
      return
    }

    const savedSearchData = loadSearchDataFromLocalStorage()
    const fromDate = savedSearchData?.fromDate
      ? moment(savedSearchData?.fromDate)
      : null
    const today = moment().startOf('day')

    if (
      savedSearchData?.fromDate &&
      savedSearchData?.toDate &&
      fromDate &&
      fromDate.isSameOrAfter(today)
    ) {
      setSearchData({
        ...savedSearchData,
        fromDate: new Date(savedSearchData.fromDate),
        toDate: new Date(savedSearchData.toDate)
      })
    } else {
      setSearchData({
        fromDate: moment().toDate(),
        toDate: moment().add(1, 'day').toDate(),
        selectedCity: cities[0]?.id || 0
      })
    }
  }, [cities])

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
      nights: dateMode === 'exact' ? '' : searchData.nights?.toString() ?? '',
      dateMode: dateMode.toString(),
      tab: 'hotel'
    })

    return queryParams
  }

  const handleSearch = async (searchData: SearchData) => {
    try {
      setIsSearchError(false)
      const { fromDate, toDate, selectedCity, travelersData, nights } =
        searchData
      const queryParams = generateSearchQueryParams(searchData)
      navigate(`/packages?${queryParams.toString()}`)

      setIsLoadingFilteredHotelPackages(true)

      if (dateMode === 'exact') {
        const searchPackagesResponse = await searchHotelsAsync({
          cities: [selectedCity],
          adults: travelersData.adultsCount,
          childs: travelersData.childrenAges,
          dateFrom: moment(fromDate).set({ hour: 14 }).format(),
          dateTo: moment(toDate).set({ hour: 12 }).format(),
          bookingType: 2,
          lateCheckout: false,
          nightsCorrectionLowerValue: 0,
          nightsCorrectionUpperValue: 0
        })
        setFilteredHotelPackages(searchPackagesResponse)
      }

      if (dateMode === 'approximate') {
        const searchPackagesResponse = await searchHotelsAsync({
          cities: [selectedCity],
          adults: travelersData.adultsCount,
          childs: travelersData.childrenAges,
          dateFrom: moment(fromDate).set({ hour: 14 }).format(),
          dateTo: moment(toDate).set({ hour: 12 }).format(),
          bookingType: 2,
          lateCheckout: false,
          nightsCorrectionLowerValue: 0,
          nightsCorrectionUpperValue: 0,
          nights: -1
        })
        setFilteredHotelPackages(searchPackagesResponse)
      }

      saveSearchDataToLocalStorage(searchData)
    } catch (error) {
      setIsSearchError(true)
    } finally {
      setIsLoadingFilteredHotelPackages(false)
    }
  }

  const setSearchData = (data: Partial<SearchData>) => {
    setSearchDataState(prevData => ({ ...prevData, ...data }))
  }

  const navigateToDefaultSearch = () => {
    const queryParams = generateSearchQueryParams(searchData)
    navigate(`/packages?${queryParams.toString()}`)
  }

  useEffect(() => {
    if (
      isAllowedSearchRoute &&
      searchData.fromDate &&
      searchData.toDate &&
      filteredHotelPackages.length === 0
    ) {
      handleSearch(searchData)
    }
  }, [searchData.fromDate, searchData.toDate, filteredHotelPackages.length])

  useEffect(() => {
    const getDateFromParam = (param: string | null) =>
      param ? new Date(param) : null

    const currentData = {} as SearchData

    const fromParam = searchParams.get('from')
    const toParam = searchParams.get('to')
    const cityParam = searchParams.get('city')
    const adultsCountParam = searchParams.get('adultsCount')
    const childrenCountParam = searchParams.get('childrenCount')
    const childrenAgesParam = searchParams.get('childrenAges')
    const dateMode = searchParams.get('dateMode')

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

    if (dateMode) {
      setDateMode(dateMode as DateModeType)
    }

    setSearchData(currentData)
  }, [searchParams])

  return (
    <SearchContext.Provider
      value={{
        searchData,
        handleSearch,
        setSearchData,
        setDateMode,
        dateMode,
        filteredHotelPackages,
        isLoadingFilteredHotelPackages,
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

export const useHotelPackagesSearchContext = () => {
  const context = useContext(SearchContext)

  if (!context) {
    throw new Error(
      'useHotelPackagesSearchContext must be used within a HotelPackagesSearchProvider'
    )
  }

  return context
}
