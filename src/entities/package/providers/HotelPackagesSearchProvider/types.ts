import { type PackageEntity } from '@entities/package'

export type SearchData = {
  fromDate: Date | null
  toDate: Date | null
  selectedCity: number
  travelersData: SearchTravelersData
}

export type SearchContextType = {
  searchData: SearchData
  handleSearch: (searchData: SearchData) => void
  setSearchData: (data: Partial<SearchData>) => void
  filteredHotelPackages: PackageEntity[]
  isLoadingFilteredHotelPackages?: boolean
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
