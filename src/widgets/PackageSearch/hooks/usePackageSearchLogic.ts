import { useCallback } from 'react'
import { usePackagesSearchContext } from '@entities/package'
import { type SearchData } from '@entities/package/providers/PackagesSearchProvider/types'

/**
 * Hook that extracts package search logic from the context
 * This separates the business logic from the UI components
 */
export const usePackageSearchLogic = () => {
  const {
    searchData,
    handleSearch,
    setSearchData,
    availableDepartureDates,
    availableReturnDates,
    isLoadingReturnDates,
    handleFromDateClick,
    filteredPackages,
    isLoadingFilteredPackages,
    isSearchError,
    isAllowedSearchRoute,
    navigateToDefaultSearch,
    cities
  } = usePackagesSearchContext()

  const handleDateAccept = useCallback(
    (fromDate: Date | null, toDate?: Date | null) => {
      setSearchData({ fromDate, toDate })
    },
    [setSearchData]
  )

  const handleCityChange = useCallback(
    (selectedCity: number) => {
      setSearchData({ selectedCity })
    },
    [setSearchData]
  )

  const handleTravelersChange = useCallback(
    (travelersData: SearchData['travelersData']) => {
      setSearchData({ travelersData })
    },
    [setSearchData]
  )

  const handleSearchClick = useCallback(() => {
    handleSearch(searchData)
  }, [handleSearch, searchData])

  return {
    // Search data
    searchData,
    cities,
    
    // Handlers
    handleDateAccept,
    handleCityChange,
    handleTravelersChange,
    handleSearchClick,
    handleFromDateClick,
    
    // Flight dates
    availableDepartureDates,
    availableReturnDates,
    isLoadingReturnDates,
    
    // Results
    filteredPackages,
    isLoadingFilteredPackages,
    isSearchError,
    
    // Navigation
    isAllowedSearchRoute,
    navigateToDefaultSearch
  }
}

