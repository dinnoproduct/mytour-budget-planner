import React from 'react'
import { SearchMultiCities } from '@features/SearchMultiCities'
import { DatePickerFlexibleSearch } from '@features/DatePickerFlexibleSearch'
import { SearchTravelers } from '@features/SearchTravelers'
import type { PackageCity } from '@entities/package'
import type { SearchTravelersData } from '@features/SearchTravelers/ui/types'

interface HotelSearchFormFieldProps {
  selectedCity: number | number[]
  cities: PackageCity[]
  onCityChange: (selectedCityIds: number[]) => void
  fromDate: Date | null
  toDate: Date | null
  onDateAccept: (fromDate: Date, toDate?: Date | null, days?: number) => void
  travelersData: SearchTravelersData
  onTravelersChange: (travelersData: SearchTravelersData) => void
}

export const HotelSearchFormField: React.FC<HotelSearchFormFieldProps> = ({
  selectedCity,
  cities,
  onCityChange,
  fromDate,
  toDate,
  onDateAccept,
  travelersData,
  onTravelersChange
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
      />

      <SearchTravelers
        defaultData={travelersData}
        onChange={onTravelersChange}
      />
    </>
  )
}

