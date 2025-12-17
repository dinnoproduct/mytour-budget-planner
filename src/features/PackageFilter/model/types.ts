export type FilterOptions = {
  name: string[]
  stars: number[]
  price: { minValue: number; maxValue: number }
}

export type FilterParams = {
  priceRange: { minValue: number; maxValue: number }
  packageSelectHotel: string[]
  hotelRatingSelect: number[]
}
