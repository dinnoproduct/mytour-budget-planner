import { type PackageCity, type PackageEntity } from '@entities/package'

export type SearchData = {
  fromDate: Date | null
  toDate: Date | null
  selectedCity: number
  nights?: number
  travelersData: SearchTravelersData
  departureFlightId: number | null
  returnFlightId: number | null
}

export type SearchContextType = {
  searchData: SearchData
  handleSearch: (searchData: SearchData) => void
  setSearchData: (data: Partial<SearchData>) => void
  setDateMode: React.Dispatch<React.SetStateAction<DateModeType>>
  dateMode: DateModeType
  availableDepartureDates: Date[]
  availableReturnDates: Date[]
  isLoadingReturnDates: boolean
  handleFromDateClick: (date: Date) => void
  filteredPackages: PackageEntity[]
  isLoadingFilteredPackages?: boolean
  generateSearchQueryParams: (searchData: SearchData) => URLSearchParams
  isSearchError?: boolean
  isAllowedSearchRoute?: boolean
  navigateToDefaultSearch: () => void
  cities: PackageCity[]
}

export type DateModeType = 'exact' | 'approximate'

type SearchTravelersData = {
  childrenCount: number
  adultsCount: number
  childrenAges: number[]
}
