export type FilterOptions = {
  name: string[]
  stars: number[]
  price: { minValue: number; maxValue: number }
  cityFilters: CityFilterOption[]
}

export type FilterParams = {
  priceRange: { minValue: number; maxValue: number }
  packageSelectHotel: string[]
  hotelRatingSelect: number[]
  cityFilterValues: Record<string, number[]>
}

export type CityFilterValueOption = {
  id: number
  label: string
  cityIds: number[]
}

export type CityFilterOption = {
  id: number
  title: string
  values: CityFilterValueOption[]
}
