import React, { useCallback } from 'react'
import { useHotelPackagesSearchContext } from '@entities/package'
import { Layouts } from '@widgets/PackageSearch/ui/Layouts.tsx'
import { HotelSearchFormField } from './HotelSearchFormField'
import { SearchButton } from './SearchButton'

interface HotelSearchFormProps {
  onSearch?: () => void
}

export const HotelSearchForm: React.FC<HotelSearchFormProps> = ({
  onSearch
}) => {
  const { searchData, handleSearch, setSearchData, cities } =
    useHotelPackagesSearchContext()

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
    (travelersData: typeof searchData.travelersData) => {
      setSearchData({ travelersData })
    },
    [setSearchData]
  )

  const handleSearchClick = useCallback(() => {
    handleSearch(searchData)
    onSearch?.()
  }, [handleSearch, searchData, onSearch])

  return (
    <Layouts>
      <HotelSearchFormField
        selectedCity={searchData.selectedCity}
        cities={cities}
        onCityChange={handleCityChange}
        fromDate={searchData.fromDate}
        toDate={searchData.toDate}
        onDateAccept={handleDateAccept}
        travelersData={searchData.travelersData}
        onTravelersChange={handleTravelersChange}
      />
      <SearchButton onClick={handleSearchClick} />
    </Layouts>
  )
}
