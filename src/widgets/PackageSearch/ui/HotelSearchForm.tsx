import React from 'react'
import { Layouts } from '@widgets/PackageSearch/ui/Layouts'
import { HotelSearchFormField } from './HotelSearchFormField'
import { SearchButton } from './SearchButton'
import { useHotelSearchLogic } from '../hooks/useHotelSearchLogic'

interface HotelSearchFormProps {
  onSearch?: () => void
}

export const HotelSearchForm: React.FC<HotelSearchFormProps> = ({
  onSearch
}) => {
  const {
    searchData,
    cities,
    handleDateAccept,
    handleCityChange,
    handleTravelersChange,
    handleSearchClick
  } = useHotelSearchLogic()

  const handleSearchClickWithCallback = () => {
    handleSearchClick()
    onSearch?.()
  }

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
      <SearchButton onClick={handleSearchClickWithCallback} />
    </Layouts>
  )
}
