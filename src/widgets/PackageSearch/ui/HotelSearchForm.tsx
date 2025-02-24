import React from 'react'
import { useTranslation } from 'react-i18next'
import { useHotelPackagesSearchContext } from '@entities/package'
import { Button } from '@ui'
import { SearchCities } from '@features/SearchCities'
import { SearchTravelers } from '@features/SearchTravelers'
import { DatePicker } from '@features/DatePicker'
import { Layouts } from '@widgets/PackageSearch/ui/Layouts.tsx'

export const HotelSearchForm = ({ onSearch }: { onSearch?: () => void }) => {
  const { t } = useTranslation()
  const { searchData, handleSearch, setSearchData, cities } =
    useHotelPackagesSearchContext()

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
        onChange={selectedCity => {
          setSearchData({ selectedCity })
        }}
        cities={cities}
        placeholder="City"
      />

      <DatePicker
        fromDate={searchData.fromDate}
        toDate={searchData.toDate}
        onAccept={handleAccept}
      />

      <SearchTravelers
        defaultData={searchData.travelersData}
        onChange={travelersData => setSearchData({ travelersData })}
      />

      <Button
        size="lg"
        width={{ base: 'full', md: 'auto' }}
        onClick={handleSearchClick}
      >
        {t`search`}
      </Button>
    </Layouts>
  )
}
