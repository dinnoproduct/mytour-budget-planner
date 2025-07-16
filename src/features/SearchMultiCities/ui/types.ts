import { type PackageCity } from '@entities/package'

export type SearchMultiCitiesProps = {
  defaultSelectedCity?: number | number[]
  cities: PackageCity[]
  onChange: (selectedCityIds: number[]) => void
  placeholder?: string
}

