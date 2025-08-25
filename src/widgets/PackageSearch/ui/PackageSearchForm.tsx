import React from 'react'
import { DatePickerFlights } from '@features/DatePickerFlights'
import { useTranslation } from 'react-i18next'
import { useCities, usePackagesSearchContext } from '@entities/package'
import { Button } from '@ui'
import { SearchCities } from '@features/SearchCities'
import { SearchTravelers } from '@features/SearchTravelers'
import { Layouts } from '@widgets/PackageSearch/ui/Layouts.tsx'

export const PackageSearchForm = ({ onSearch }: { onSearch?: () => void }) => {
  const { t } = useTranslation()
  const {
    searchData,
    handleSearch,
    setSearchData,
    availableDepartureDates,
    availableReturnDates,
    isLoadingReturnDates,
    handleFromDateClick
  } = usePackagesSearchContext()
  const { data: cities = [] } = useCities()

  const handleAccept = (fromDate: Date | null, toDate?: Date | null) => {
    setSearchData({ fromDate, toDate })
  }

  const handleSearchClick = () => {
    handleSearch(searchData)
    onSearch && onSearch()
  }

  return (
    <Layouts>
      <SearchCities
        defaultSelectedCity={searchData.selectedCity}
        onChange={selectedCity => setSearchData({ selectedCity })}
        cities={cities}
      />

      <DatePickerFlights
        fromDate={searchData.fromDate}
        toDate={searchData.toDate}
        onAccept={handleAccept}
        onFromDateClick={handleFromDateClick}
        availableDepartureDates={availableDepartureDates}
        availableReturnDates={availableReturnDates}
        isLoadingReturnDates={isLoadingReturnDates}
      />

      <SearchTravelers
        defaultData={searchData.travelersData}
        onChange={travelersData => setSearchData({ travelersData })}
      />

      <Button
        borderRadius='12px'
        size="lg"
        width={{ base: 'full', md: 'auto' }}
        onClick={handleSearchClick}
      >
        {t`search`}
      </Button>
    </Layouts>
  )
}
