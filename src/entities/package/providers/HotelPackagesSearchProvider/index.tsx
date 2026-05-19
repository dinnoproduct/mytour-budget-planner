"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { useLocation, useSearchParams } from '@shared/lib/router'
import { useLanguageNavigate } from '../../../../hooks/useLanguageNavigate'
import { getPathWithoutLanguage } from '../../../../utils/languageRoutes'
import moment from 'moment'
import {
  type DateModeType,
  type SearchContextType,
  type SearchData
} from './types'
import {
  type PackageEntity,
  useCitiesOnlyHotel,
  useSearchAsync
} from '@entities/package'
import { defaultSelectedHotelCity } from "@/constants/constants";
import { appendStoredUTMsToSearchParams } from "@/utils/utmParams";

const LOCAL_STORAGE_KEY = 'hotel_packages_search_params'

const defaultSearchData: SearchData = {
  fromDate: null,
  toDate: null,
  selectedCity: [],
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
  const { navigateToPackages } = useLanguageNavigate()
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
  const searchAsync = useSearchAsync()
  const [searchData, setSearchDataState] =
    useState<SearchData>(defaultSearchData)
  const hasInitializedData = useRef(false)
  const hasPerformedDefaultSearch = useRef(false)

  const saveSearchDataToLocalStorage = (data: SearchData) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data))
  }

  const isAllowedSearchRoute = useMemo(() => {
    const pathWithoutLanguage = getPathWithoutLanguage(location.pathname)
    const isAllowed = ALLOWED_SEARCH_ROUTES.some(route => {
      if (route.path === pathWithoutLanguage) {
        if (route.query.length === 0) return true

        return route.query.every(query => {
          const value = searchParams.get(query[0])

          return value && value === query[1]
        })
      }

      return false
    })

    return isAllowed
  }, [location.pathname, searchParams])

  const loadSearchDataFromLocalStorage = (): SearchData | null => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY)

    return savedData ? JSON.parse(savedData) : null
  }

  useEffect(() => {
    if (hasInitializedData.current || (searchData.fromDate && searchData.toDate)) return
    if (cities.length === 0) return

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
      // Validate and filter selectedCity IDs to only include cities that exist in the current cities list
      const savedCityIds = savedSearchData.selectedCity != null
        ? (Array.isArray(savedSearchData.selectedCity)
            ? savedSearchData.selectedCity
            : [savedSearchData.selectedCity])
        : []
      
      const validCityIds = savedCityIds.filter(cityId => 
        cities.some(city => city.id === cityId)
      )
      
      // If no valid cities found, fall back to defaultSelectedHotelCity filtered by available cities
      const selectedCity = validCityIds.length > 0
        ? validCityIds
        : defaultSelectedHotelCity.filter(cityId =>
            cities.some(city => city.id === cityId)
          )

      setSearchData({
        ...savedSearchData,
        fromDate: new Date(savedSearchData.fromDate),
        toDate: new Date(savedSearchData.toDate),
        selectedCity
      })
    } else {
      setSearchData({
        fromDate: moment().toDate(),
        toDate: moment().add(1, 'day').toDate(),
        selectedCity: cities[0] ? defaultSelectedHotelCity.filter(cityId =>
          cities.some(city => city.id === cityId)
        ) : []
      })
    }
    
    hasInitializedData.current = true
  }, [cities])

  const generateSearchQueryParams = (searchData: SearchData) => {
    const formatDate = (date: Date | null) =>
      date ? moment(date).format('YYYY-MM-DD') : ''

    const cityParam = Array.isArray(searchData.selectedCity)
      ? searchData.selectedCity.join(',')
      : searchData.selectedCity

    const queryParams = new URLSearchParams({
      from: formatDate(searchData.fromDate),
      to: formatDate(searchData.toDate),
      city: cityParam.toString(),
      adultsCount: searchData.travelersData.adultsCount.toString(),
      childrenCount: searchData.travelersData.childrenCount.toString(),
      childrenAges: searchData.travelersData.childrenCount === 0 ? '' : searchData.travelersData.childrenAges.join(','),
      days: dateMode === 'exact' ? '' : searchData.days?.toString() ?? '',
      dateMode: dateMode.toString(),
      tab: 'hotel'
    })

    return queryParams
  }

  const handleSearch = async (searchData: SearchData) => {
    try {
      setIsSearchError(false)
      const { fromDate, toDate, selectedCity, travelersData, days } = searchData
      const queryParams = generateSearchQueryParams(searchData)
      appendStoredUTMsToSearchParams(queryParams)
      navigateToPackages(queryParams.toString())

      setIsLoadingFilteredHotelPackages(true)

      let searchPackagesResponse: PackageEntity[] = []
      const selectedCitiesArray = Array.isArray(selectedCity)
        ? selectedCity
        : [selectedCity]

      if (dateMode === 'exact') {
        searchPackagesResponse = await searchAsync({
          cities: selectedCitiesArray,
          adults: travelersData.adultsCount,
          childs: travelersData.childrenCount === 0 ? [] : travelersData.childrenAges,
          dateFrom: moment(fromDate).set({ hour: 14 }).format(),
          dateTo: moment(toDate).set({ hour: 12 }).format(),
          bookingType: 2,
          lateCheckout: false,
          nightsCorrectionLowerValue: 0,
          nightsCorrectionUpperValue: 0
        })
        saveSearchDataToLocalStorage(searchData)
      }

      if (dateMode === 'approximate') {
        searchPackagesResponse = await searchAsync({
          cities: selectedCitiesArray,
          adults: travelersData.adultsCount,
          childs: travelersData.childrenCount === 0 ? [] : travelersData.childrenAges,
          dateFrom: moment(fromDate).set({ hour: 14 }).format(),
          dateTo: moment(toDate).set({ hour: 12 }).format(),
          bookingType: 2,
          lateCheckout: false,
          nightsCorrectionLowerValue: 0,
          nightsCorrectionUpperValue: 0,
          nights: (days || 0) - 1
        })
      }

      setFilteredHotelPackages(searchPackagesResponse)
    } catch (error) {
      setIsSearchError(true)
    } finally {
      setIsLoadingFilteredHotelPackages(false)
    }
  }

  const setSearchData = (data: Partial<SearchData>) => {
    setSearchDataState(prevData => ({
      ...prevData,
      ...data,
      selectedCity: Array.isArray(data.selectedCity)
        ? data.selectedCity
        : data.selectedCity !== undefined
          ? [data.selectedCity]
          : prevData.selectedCity
    }))
  }

  const navigateToDefaultSearch = () => {
    const queryParams = generateSearchQueryParams(searchData)
    appendStoredUTMsToSearchParams(queryParams)
    navigateToPackages(queryParams.toString())
  }

  useEffect(() => {
    if (
      isAllowedSearchRoute &&
      searchData.fromDate &&
      searchData.toDate &&
      filteredHotelPackages.length === 0 &&
      !hasPerformedDefaultSearch.current
    ) {
      handleSearch(searchData)
      hasPerformedDefaultSearch.current = true
    }
  }, [isAllowedSearchRoute, searchData.fromDate, searchData.toDate, filteredHotelPackages.length])

  useEffect(() => {
    // Only sync URL params when we're on the hotel tab to prevent
    // packages search params from polluting hotel search data
    const tabParam = searchParams.get('tab')
    if (tabParam !== 'hotel') {
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
    const dateModeParam = searchParams.get('dateMode')
    const daysParam = searchParams.get('days')

    if (fromParam) {
      currentData.fromDate = getDateFromParam(fromParam)
    }

    if (toParam) {
      currentData.toDate = getDateFromParam(toParam)
    }

    if (cityParam) {
      currentData.selectedCity = cityParam
        .split(',')
        .map(s => Number(s.trim()))
        .filter(n => !isNaN(n))
    }

    if (childrenCountParam || childrenAgesParam || adultsCountParam) {
      const childrenCount = parseInt(childrenCountParam || '0', 10)
      currentData.travelersData = {
        adultsCount: parseInt(adultsCountParam || '0', 10),
        childrenCount: childrenCount,
        childrenAges: childrenCount === 0 
          ? [] 
          : ((childrenAgesParam || '').split(',').filter(Boolean).map(Number) || [])
      }
    }

    if (dateModeParam) {
      setDateMode(dateModeParam as DateModeType)
    }

    if (daysParam) {
      currentData.days = parseInt(daysParam, 10)
    }

    // Only update if we have meaningful data from URL params
    const hasUrlData = Object.keys(currentData).length > 0
    if (hasUrlData) {
      setSearchData(currentData)
    }
    
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
