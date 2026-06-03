import { useCallback } from 'react'
import { useCyprusPackagesSearchContext } from '@entities/package'
import { type SearchData } from '@entities/package/providers/HotelPackagesSearchProvider/types'

export const useCyprusSearchLogic = () => {
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
    cities,
  } = useCyprusPackagesSearchContext()

  const handleDateAccept = useCallback(
    (fromDate: Date | null, toDate?: Date | null, days?: number) => {
      setSearchData({ fromDate, toDate, days })
    },
    [setSearchData],
  )

  const handleCityChange = useCallback(
    (selectedCityIds: number[]) => {
      setSearchData({ selectedCity: selectedCityIds })
    },
    [setSearchData],
  )

  const handleTravelersChange = useCallback(
    (travelersData: SearchData['travelersData']) => {
      setSearchData({ travelersData })
    },
    [setSearchData],
  )

  const handleSearchClick = useCallback(() => {
    handleSearch(searchData)
  }, [handleSearch, searchData])

  return {
    searchData,
    cities,
    dateMode,
    handleDateAccept,
    handleCityChange,
    handleTravelersChange,
    handleSearchClick,
    setDateMode,
    filteredHotelPackages,
    isLoadingFilteredHotelPackages,
    isSearchError,
    isAllowedSearchRoute,
    navigateToDefaultSearch,
  }
}
