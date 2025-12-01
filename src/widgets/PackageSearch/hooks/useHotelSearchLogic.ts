import { useCallback } from 'react'
import { useHotelPackagesSearchContext } from '@entities/package'
import { type SearchData } from '@entities/package/providers/HotelPackagesSearchProvider/types'

/**
 * Hook that extracts hotel search logic from the context
 * This separates the business logic from the UI components
 */
export const useHotelSearchLogic = () => {
  const {
    searchData,
    handleSearch,
    setSearchData,
    setDateMode,
    dateMode,
    filteredHotelPackages,
    isLoadingFilteredHotelPackages,
    isSearchError,
    isAllowedSearchRoute,
    navigateToDefaultSearch,
    cities
  } = useHotelPackagesSearchContext()

  const handleDateAccept = useCallback(
    (fromDate: Date | null, toDate?: Date | null, days?: number) => {
      setSearchData({ fromDate, toDate, days })
    },
    [setSearchData]
  )

  const handleCityChange = useCallback(
    (selectedCityIds: number[]) => {
      setSearchData({ selectedCity: selectedCityIds })
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
    dateMode,
    
    // Handlers
    handleDateAccept,
    handleCityChange,
    handleTravelersChange,
    handleSearchClick,
    setDateMode,
    
    // Results
    filteredHotelPackages,
    isLoadingFilteredHotelPackages,
    isSearchError,
    
    // Navigation
    isAllowedSearchRoute,
    navigateToDefaultSearch
  }
}

