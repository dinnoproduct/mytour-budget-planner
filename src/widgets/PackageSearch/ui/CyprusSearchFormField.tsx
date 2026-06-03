import React from 'react'
import { SearchMultiCities } from '@features/SearchMultiCities'
import { DatePickerFlexibleSearch } from '@features/DatePickerFlexibleSearch'
import { SearchTravelers } from '@features/SearchTravelers'
import type { PackageCity } from '@entities/package'
import type { SearchTravelersData } from '@features/SearchTravelers/ui/types'
import type { DateModeType } from '@entities/package'
import { type Dispatch, type SetStateAction } from 'react'

interface CyprusSearchFormFieldProps {
  selectedCity: number | number[]
  cities: PackageCity[]
  onCityChange: (selectedCityIds: number[]) => void
  fromDate: Date | null
  toDate: Date | null
  onDateAccept: (fromDate: Date, toDate?: Date | null, days?: number) => void
  travelersData: SearchTravelersData
  onTravelersChange: (travelersData: SearchTravelersData) => void
  dateMode: DateModeType
  setDateMode: Dispatch<SetStateAction<DateModeType>>
  searchDays?: number
}

export const CyprusSearchFormField: React.FC<CyprusSearchFormFieldProps> = ({
  selectedCity,
  cities,
  onCityChange,
  fromDate,
  toDate,
  onDateAccept,
  travelersData,
  onTravelersChange,
  dateMode,
  setDateMode,
  searchDays,
}) => {
  return (
    <>
      <SearchMultiCities
        defaultSelectedCity={selectedCity}
        onChange={onCityChange}
        cities={cities}
        placeholder="City"
      />

      <DatePickerFlexibleSearch
        fromDate={fromDate}
        toDate={toDate}
        onAccept={onDateAccept}
        dateMode={dateMode}
        setDateMode={setDateMode}
        searchDays={searchDays}
      />

      <SearchTravelers
        defaultData={travelersData}
        onChange={onTravelersChange}
      />
    </>
  )
}
