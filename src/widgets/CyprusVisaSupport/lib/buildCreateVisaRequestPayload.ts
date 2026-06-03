import { type PackageCity } from '@entities/package'
import { type SearchData } from '@entities/package/providers/HotelPackagesSearchProvider/types'

const CYPRUS_COUNTRY_NAME = 'Cyprus'
const VISA_REQUEST_PLATFORM = 'Web'

export const buildCreateVisaRequestPayload = (
  searchData: SearchData,
  cities: PackageCity[],
) => {
  const selectedCityIds = Array.isArray(searchData.selectedCity)
    ? searchData.selectedCity
    : [searchData.selectedCity]

  const cityLabel = cities
    .filter((city) => selectedCityIds.includes(city.id))
    .map((city) => city.nameEng || city.nameArm || city.nameRus || '')
    .filter(Boolean)
    .join(', ')

  const startDate = searchData.fromDate ?? new Date()

  return {
    startDate: startDate.toISOString(),
    city: cityLabel || CYPRUS_COUNTRY_NAME,
    country: CYPRUS_COUNTRY_NAME,
    travelersCount:
      searchData.travelersData.adultsCount +
      searchData.travelersData.childrenCount,
    platform: VISA_REQUEST_PLATFORM,
  }
}
