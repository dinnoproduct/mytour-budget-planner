import { type PackageCity, type PackageEntity } from '@entities/package'

export type DateModeType = 'exact' | 'approximate'

export type SearchData = {
  fromDate: Date | null
  toDate: Date | null
  days?: number
  selectedCity: number | number[]
  travelersData: SearchTravelersData
}

export type SearchContextType = {
  searchData: SearchData
  handleSearch: (searchData: SearchData) => void
  setSearchData: (data: Partial<SearchData>) => void
  setDateMode: React.Dispatch<React.SetStateAction<DateModeType>>
  dateMode: DateModeType
  filteredHotelPackages: PackageEntity[]
  isLoadingFilteredHotelPackages?: boolean
  generateSearchQueryParams: (searchData: SearchData) => URLSearchParams
  isSearchError?: boolean
  isAllowedSearchRoute?: boolean
  navigateToDefaultSearch: () => void
  cities: PackageCity[]
}

type SearchTravelersData = {
  childrenCount: number
  adultsCount: number
  childrenAges: number[]
}
