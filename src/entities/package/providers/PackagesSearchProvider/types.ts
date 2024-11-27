import { type PackageEntity } from '@entities/package'

export type SearchData = {
  fromDate: Date | null
  toDate: Date | null
  selectedCity: number
  travelersData: SearchTravelersData
  departureFlightId: number | null
  returnFlightId: number | null
}

export type SearchContextType = {
  searchData: SearchData
  handleSearch: (searchData: SearchData) => void
  setSearchData: (data: Partial<SearchData>) => void
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
}

type SearchTravelersData = {
  childrenCount: number
  adultsCount: number
  childrenAges: number[]
}
