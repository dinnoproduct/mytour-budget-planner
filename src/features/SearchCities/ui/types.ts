import { type PackageCityOption } from '@entities/package/model/types.ts'

export type SearchCitiesProps = {
  defaultSelectedCity?: number
  onChange?: (city: number) => void
  cities: PackageCityOption[]
}
