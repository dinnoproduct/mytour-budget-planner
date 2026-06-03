'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useLocation, useSearchParams } from '@shared/lib/router'
import { useLanguageNavigate } from '../../../../hooks/useLanguageNavigate'
import { getPathWithoutLanguage } from '../../../../utils/languageRoutes'
import moment from 'moment'
import {
  type DateModeType,
  type SearchContextType,
  type SearchData,
} from '../HotelPackagesSearchProvider/types'
import {
  type PackageEntity,
  useCitiesOnlyHotel,
  useSearchAsync,
} from '@entities/package'
import {
  CYPRUS_COUNTRY_ID,
  defaultSelectedCyprusCity,
} from '@/constants/constants'
import { appendStoredUTMsToSearchParams } from '@/utils/utmParams'

const LOCAL_STORAGE_KEY = 'cyprus_packages_search_params'

const defaultSearchData: SearchData = {
  fromDate: null,
  toDate: null,
  selectedCity: [],
  travelersData: {
    adultsCount: 2,
    childrenCount: 0,
    childrenAges: [],
  },
}

const ALLOWED_SEARCH_ROUTES = [
  { path: '/packages', query: [['tab', 'cyprus']] },
]

const getDefaultApproximateDates = () => {
  const date = new Date()
  const fromDate = new Date(date.getFullYear(), date.getMonth() + 1, 1)
  const toDate = new Date(date.getFullYear(), date.getMonth() + 2, 0)

  return { fromDate, toDate }
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export const CyprusPackagesSearchProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const { navigateToPackages } = useLanguageNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const safeSearchParams = searchParams ?? new URLSearchParams()
  const [isLoadingFilteredHotelPackages, setIsLoadingFilteredHotelPackages] =
    useState(false)
  const [isSearchError, setIsSearchError] = useState(false)
  const [dateMode, setDateMode] = useState<DateModeType>('approximate')
  const [filteredHotelPackages, setFilteredHotelPackages] = useState<
    PackageEntity[]
  >([])
  const { data: allHotelCities = [] } = useCitiesOnlyHotel()
  const cities = useMemo(
    () => allHotelCities.filter((city) => city.countryId === CYPRUS_COUNTRY_ID),
    [allHotelCities],
  )
  const searchAsync = useSearchAsync()
  const [searchData, setSearchDataState] =
    useState<SearchData>(defaultSearchData)
  const hasInitializedData = useRef(false)
  const hasPerformedDefaultSearch = useRef(false)

  const saveSearchDataToLocalStorage = (data: SearchData) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data))
  }

  const isAllowedSearchRoute = useMemo(() => {
    const pathWithoutLanguage = getPathWithoutLanguage(location.pathname || '')

    return ALLOWED_SEARCH_ROUTES.some((route) => {
      if (route.path !== pathWithoutLanguage) {
        return false
      }

      if (route.query.length === 0) {
        return true
      }

      return route.query.every((query) => {
        const value = safeSearchParams.get(query[0])

        return value && value === query[1]
      })
    })
  }, [location.pathname, searchParams])

  const loadSearchDataFromLocalStorage = (): SearchData | null => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY)

    return savedData ? JSON.parse(savedData) : null
  }

  useEffect(() => {
    if (hasInitializedData.current || (searchData.fromDate && searchData.toDate)) {
      return
    }
    if (cities.length === 0) {
      return
    }

    const savedSearchData = loadSearchDataFromLocalStorage()
    const fromDate = savedSearchData?.fromDate
      ? moment(savedSearchData.fromDate)
      : null
    const today = moment().startOf('day')
    const validCyprusCityIds = defaultSelectedCyprusCity.filter((cityId) =>
      cities.some((city) => city.id === cityId),
    )
    const fallbackCityIds =
      validCyprusCityIds.length > 0
        ? validCyprusCityIds
        : cities.map((city) => city.id)

    if (
      savedSearchData?.fromDate &&
      savedSearchData?.toDate &&
      fromDate &&
      fromDate.isSameOrAfter(today)
    ) {
      const savedCityIds = savedSearchData.selectedCity != null
        ? Array.isArray(savedSearchData.selectedCity)
          ? savedSearchData.selectedCity
          : [savedSearchData.selectedCity]
        : []
      const selectedCity = savedCityIds.filter((cityId) =>
        cities.some((city) => city.id === cityId),
      )

      setSearchData({
        ...savedSearchData,
        fromDate: new Date(savedSearchData.fromDate),
        toDate: new Date(savedSearchData.toDate),
        days: savedSearchData.days ?? 7,
        selectedCity: selectedCity.length > 0 ? selectedCity : fallbackCityIds,
      })
      setDateMode(savedSearchData.days ? 'approximate' : dateMode)
    } else {
      const { fromDate: defaultFrom, toDate: defaultTo } =
        getDefaultApproximateDates()

      setSearchData({
        fromDate: defaultFrom,
        toDate: defaultTo,
        days: 7,
        selectedCity: fallbackCityIds,
        travelersData: defaultSearchData.travelersData,
      })
      setDateMode('approximate')
    }

    hasInitializedData.current = true
  }, [cities])

  const generateSearchQueryParams = (data: SearchData) => {
    const formatDate = (date: Date | null) =>
      date ? moment(date).format('YYYY-MM-DD') : ''

    const cityParam = Array.isArray(data.selectedCity)
      ? data.selectedCity.join(',')
      : data.selectedCity

    const queryParams = new URLSearchParams(safeSearchParams.toString())
    queryParams.set('from', formatDate(data.fromDate))
    queryParams.set('to', formatDate(data.toDate))
    queryParams.set('city', cityParam.toString())
    queryParams.set('adultsCount', data.travelersData.adultsCount.toString())
    queryParams.set('childrenCount', data.travelersData.childrenCount.toString())
    queryParams.set(
      'childrenAges',
      data.travelersData.childrenCount === 0
        ? ''
        : data.travelersData.childrenAges.join(','),
    )
    queryParams.set('days', dateMode === 'exact' ? '' : data.days?.toString() ?? '')
    queryParams.set('dateMode', dateMode.toString())
    queryParams.set('tab', 'cyprus')

    return queryParams
  }

  const handleSearch = async (nextSearchData: SearchData) => {
    try {
      setIsSearchError(false)
      const { fromDate, toDate, selectedCity, travelersData, days } =
        nextSearchData
      const queryParams = generateSearchQueryParams(nextSearchData)
      appendStoredUTMsToSearchParams(queryParams)
      navigateToPackages(queryParams.toString())

      setIsLoadingFilteredHotelPackages(true)

      const selectedCitiesArray = Array.isArray(selectedCity)
        ? selectedCity
        : [selectedCity]

      let searchPackagesResponse: PackageEntity[] = []

      if (dateMode === 'exact') {
        searchPackagesResponse = await searchAsync({
          cities: selectedCitiesArray,
          adults: travelersData.adultsCount,
          childs:
            travelersData.childrenCount === 0 ? [] : travelersData.childrenAges,
          dateFrom: moment(fromDate).set({ hour: 14 }).format(),
          dateTo: moment(toDate).set({ hour: 12 }).format(),
          bookingType: 2,
          lateCheckout: false,
          nightsCorrectionLowerValue: 0,
          nightsCorrectionUpperValue: 0,
        })
        saveSearchDataToLocalStorage(nextSearchData)
      }

      if (dateMode === 'approximate') {
        searchPackagesResponse = await searchAsync({
          cities: selectedCitiesArray,
          adults: travelersData.adultsCount,
          childs:
            travelersData.childrenCount === 0 ? [] : travelersData.childrenAges,
          dateFrom: moment(fromDate).set({ hour: 14 }).format(),
          dateTo: moment(toDate).set({ hour: 12 }).format(),
          bookingType: 2,
          lateCheckout: false,
          nightsCorrectionLowerValue: 0,
          nightsCorrectionUpperValue: 0,
          nights: (days || 0) - 1,
        })
      }

      setFilteredHotelPackages(searchPackagesResponse)
    } catch {
      setIsSearchError(true)
    } finally {
      setIsLoadingFilteredHotelPackages(false)
    }
  }

  const setSearchData = (data: Partial<SearchData>) => {
    setSearchDataState((prevData) => ({
      ...prevData,
      ...data,
      selectedCity: Array.isArray(data.selectedCity)
        ? data.selectedCity
        : data.selectedCity !== undefined
          ? [data.selectedCity]
          : prevData.selectedCity,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAllowedSearchRoute, searchData.fromDate, searchData.toDate, filteredHotelPackages.length])

  useEffect(() => {
    const tabParam = safeSearchParams.get('tab')
    if (tabParam !== 'cyprus') {
      return
    }

    const getDateFromParam = (param: string | null) =>
      param ? new Date(param) : null

    const currentData = {} as SearchData
    const fromParam = safeSearchParams.get('from')
    const toParam = safeSearchParams.get('to')
    const cityParam = safeSearchParams.get('city')
    const adultsCountParam = safeSearchParams.get('adultsCount')
    const childrenCountParam = safeSearchParams.get('childrenCount')
    const childrenAgesParam = safeSearchParams.get('childrenAges')
    const dateModeParam = safeSearchParams.get('dateMode')
    const daysParam = safeSearchParams.get('days')

    if (fromParam) {
      currentData.fromDate = getDateFromParam(fromParam)
    }

    if (toParam) {
      currentData.toDate = getDateFromParam(toParam)
    }

    if (cityParam) {
      currentData.selectedCity = cityParam
        .split(',')
        .map((s) => Number(s.trim()))
        .filter((n) => !Number.isNaN(n))
    }

    if (childrenCountParam || childrenAgesParam || adultsCountParam) {
      const childrenCount = parseInt(childrenCountParam || '0', 10)
      currentData.travelersData = {
        adultsCount: parseInt(adultsCountParam || '0', 10),
        childrenCount,
        childrenAges:
          childrenCount === 0
            ? []
            : (childrenAgesParam || '').split(',').filter(Boolean).map(Number) ||
              [],
      }
    }

    if (dateModeParam) {
      setDateMode(dateModeParam as DateModeType)
    }

    if (daysParam) {
      currentData.days = parseInt(daysParam, 10)
    }

    if (Object.keys(currentData).length > 0) {
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
        cities,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export const useCyprusPackagesSearchContext = () => {
  const context = useContext(SearchContext)

  if (!context) {
    throw new Error(
      'useCyprusPackagesSearchContext must be used within a CyprusPackagesSearchProvider',
    )
  }

  return context
}
