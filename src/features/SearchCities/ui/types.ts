import { type PackageCity } from '@entities/package'

export type SearchCitiesProps = {
  defaultSelectedCity?: number
  onChange?: (city: number) => void
  cities: PackageCity[]
}
