import React from 'react'
import { DatePickerFlights } from '@features/DatePickerFlights'
import { useTranslation } from 'react-i18next'
import { useCities } from '@entities/package'
import { Button } from '@ui'
import { SearchCities } from '@features/SearchCities'
import { SearchTravelers } from '@features/SearchTravelers'
import { Layouts } from '@widgets/PackageSearch/ui/Layouts.tsx'
import { usePackageSearchLogic } from '../hooks/usePackageSearchLogic'

export const PackageSearchForm = ({ onSearch }: { onSearch?: () => void }) => {
  const { t } = useTranslation()
  const {
    searchData,
    cities,
    handleDateAccept,
    handleCityChange,
    handleTravelersChange,
    handleSearchClick,
    availableDepartureDates,
    availableReturnDates,
    isLoadingReturnDates,
    handleFromDateClick
  } = usePackageSearchLogic()
  const { data: citiesData = [] } = useCities()
  const displayCities = cities.length > 0 ? cities : citiesData

  const handleSearchClickWithCallback = () => {
    handleSearchClick()
    onSearch?.()
  }

  return (
    <Layouts>
      <SearchCities
        defaultSelectedCity={searchData.selectedCity}
        onChange={handleCityChange}
        cities={displayCities}
      />

      <DatePickerFlights
        fromDate={searchData.fromDate}
        toDate={searchData.toDate}
        onAccept={handleDateAccept}
        onFromDateClick={handleFromDateClick}
        availableDepartureDates={availableDepartureDates}
        availableReturnDates={availableReturnDates}
        isLoadingReturnDates={isLoadingReturnDates}
      />

      <SearchTravelers
        defaultData={searchData.travelersData}
        onChange={handleTravelersChange}
      />

      <Button
        borderRadius='12px'
        size="lg"
        width={{ base: 'full', md: 'auto' }}
        onClick={handleSearchClickWithCallback}
      >
        {t`search`}
      </Button>
    </Layouts>
  )
}
