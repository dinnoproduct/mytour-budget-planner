import React from 'react'
import { Layouts } from '@widgets/PackageSearch/ui/Layouts'
import { SearchButton } from './SearchButton'
import { useCyprusSearchLogic } from '../hooks/useCyprusSearchLogic'
import { CyprusSearchFormField } from './CyprusSearchFormField'

interface CyprusSearchFormProps {
  onSearch?: () => void
}

export const CyprusSearchForm: React.FC<CyprusSearchFormProps> = ({
  onSearch,
}) => {
  const {
    searchData,
    cities,
    handleDateAccept,
    handleCityChange,
    handleTravelersChange,
    handleSearchClick,
    dateMode,
    setDateMode,
  } = useCyprusSearchLogic()

  const handleSearchClickWithCallback = () => {
    handleSearchClick()
    onSearch?.()
  }

  return (
    <Layouts>
      <CyprusSearchFormField
        selectedCity={searchData.selectedCity}
        cities={cities}
        onCityChange={handleCityChange}
        fromDate={searchData.fromDate}
        toDate={searchData.toDate}
        onDateAccept={handleDateAccept}
        travelersData={searchData.travelersData}
        onTravelersChange={handleTravelersChange}
        dateMode={dateMode}
        setDateMode={setDateMode}
        searchDays={searchData.days}
      />
      <SearchButton onClick={handleSearchClickWithCallback} />
    </Layouts>
  )
}
