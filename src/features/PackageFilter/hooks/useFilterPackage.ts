import { type PackageEntity } from '@/entities/package/model'
import { type FilterParams, type FilterOptions } from '../model'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type PackageCity } from '@/entities/package'

type LocalizedName = {
  hy?: string
  en?: string
  ru?: string
  arm?: string
  eng?: string
  rus?: string
}

const getLocalizedNameByLanguage = (
  name: LocalizedName | undefined,
  language: string
): string => {
  if (!name) {
    return ''
  }

  const normalizedLanguage = language.toLowerCase()

  if (normalizedLanguage.startsWith('hy')) {
    return name.hy || name.arm || name.en || name.eng || name.ru || name.rus || ''
  }

  if (normalizedLanguage.startsWith('ru')) {
    return name.ru || name.rus || name.en || name.eng || name.hy || name.arm || ''
  }

  return name.en || name.eng || name.hy || name.arm || name.ru || name.rus || ''
}

const getLocalizedName = (
  name: LocalizedName | undefined,
  language: string
): string => {
  return getLocalizedNameByLanguage(name, language)
}

type ResponseFilter = {
  id: number
  name: LocalizedName
  values: Array<{
    id: number
    name: LocalizedName
    cityIds: number[]
  }>
}

export const useFilterPackage = (
  packages: PackageEntity[],
  cities: PackageCity[],
  selectedCityIds: number[]
) => {
  const { i18n } = useTranslation()
  const [filterParams, setFilterParams] = useState<FilterParams>({
    priceRange: { minValue: 0, maxValue: 0 },
    packageSelectHotel: [],
    hotelRatingSelect: [],
    cityFilterValues: {}
  })

  const [isFilterActive, setIsFilterActive] = useState(false)

  const filterOptions: FilterOptions = useMemo(() => {
    if (!packages.length) {
      return {
        price: { minValue: 0, maxValue: 0 },
        name: [],
        stars: [],
        cityFilters: []
      }
    }

    const names = packages.map(pkg => pkg.hotel.name)
    const prices = packages.map(pkg => pkg.price)
    const stars = Array.from(
      new Set(packages.map(pkg => pkg.hotel.stars))
    ).sort((a, b) => b - a)

    const cityFiltersMap = new Map<
      number,
      {
        id: number
        title: string
        valuesMap: Map<number, { id: number; label: string; cityIds: Set<number> }>
      }
    >()

    const appendFilters = (filters: ResponseFilter[] | undefined) => {
      filters?.forEach(filter => {
        if (!cityFiltersMap.has(filter.id)) {
          cityFiltersMap.set(filter.id, {
            id: filter.id,
            title: getLocalizedName(filter.name, i18n.language),
            valuesMap: new Map()
          })
        }

        const filterEntry = cityFiltersMap.get(filter.id)
        if (!filterEntry) {
          return
        }

        filter.values.forEach(value => {
          if (!filterEntry.valuesMap.has(value.id)) {
            filterEntry.valuesMap.set(value.id, {
              id: value.id,
              label: getLocalizedName(value.name, i18n.language),
              cityIds: new Set<number>()
            })
          }

          const valueEntry = filterEntry.valuesMap.get(value.id)
          if (!valueEntry) {
            return
          }

          value.cityIds.forEach(cityId => {
            valueEntry.cityIds.add(cityId)
          })
        })
      })
    }

    const selectedCityIdSet = new Set(selectedCityIds)
    const sourceCities =
      selectedCityIdSet.size === 0
        ? cities
        : cities.filter(city => selectedCityIdSet.has(city.id))

    sourceCities.forEach(city => {
      appendFilters(city.filters)
    })

    const cityFilters = Array.from(cityFiltersMap.values()).map(filter => ({
      id: filter.id,
      title: filter.title,
      values: Array.from(filter.valuesMap.values()).map(value => ({
        id: value.id,
        label: value.label,
        cityIds: Array.from(value.cityIds)
      }))
    }))

    return {
      name: names,
      price: {
        minValue: Math.min(...prices),
        maxValue: Math.max(...prices)
      },
      stars,
      cityFilters
    }
  }, [packages, cities, selectedCityIds, i18n.language])

  const filteredPackages = useMemo(
    () =>
      packages.filter(pack => {
        const matchesHotel =
          filterParams.packageSelectHotel.length === 0 ||
          filterParams.packageSelectHotel.includes(pack.hotel.name)

        const matchesStars =
          filterParams.hotelRatingSelect.length === 0 ||
          filterParams.hotelRatingSelect.includes(pack.hotel.stars)

        const matchesPrice =
          (!filterParams.priceRange.minValue ||
            pack.price >= filterParams.priceRange.minValue) &&
          (!filterParams.priceRange.maxValue ||
            pack.price <= filterParams.priceRange.maxValue)

        const selectedDynamicEntries = filterOptions.cityFilters
          .map(filter => ({
            filter,
            selectedValueIds: filterParams.cityFilterValues[String(filter.id)] || []
          }))
          .filter(entry => entry.selectedValueIds.length > 0)

        const matchesDynamicFilters =
          selectedDynamicEntries.length === 0 ||
          selectedDynamicEntries.every(({ filter, selectedValueIds }) => {
            const packageFilter = pack.filters?.find(
              packageFilter => packageFilter.id === filter.id
            )

            if (!packageFilter) {
              return false
            }

            const packageValueIds = new Set(
              packageFilter.values.map(value => value.id)
            )

            // Strict match: if user selected X and Y in same filter,
            // package must contain both X and Y.
            return selectedValueIds.every(valueId => packageValueIds.has(valueId))
          })

        return matchesHotel && matchesPrice && matchesStars && matchesDynamicFilters
      }),
    [packages, filterParams, filterOptions.cityFilters]
  )

  const checkIfFiltersAreEmpty = (params: FilterParams): boolean =>
    params.packageSelectHotel.length === 0 &&
    params.hotelRatingSelect.length === 0 &&
    Object.values(params.cityFilterValues).every(values => values.length === 0) &&
    params.priceRange.minValue === 0 &&
    params.priceRange.maxValue === 0

  const onFilter = (filterParams: FilterParams) => {
    setFilterParams(filterParams)

    const areFiltersEmpty = checkIfFiltersAreEmpty(filterParams)

    setIsFilterActive(!areFiltersEmpty)
  }

  return { filterOptions, filteredPackages, isFilterActive, onFilter }
}
