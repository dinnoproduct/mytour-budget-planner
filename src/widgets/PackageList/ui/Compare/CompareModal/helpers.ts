import { type PackageCity, type PackageEntity } from '@entities/package'
import { getPluralForm } from '@/shared/helpers'
import { type CompareFilterGroup, type CompareRow, type LocalizedName } from './types'

export const getLocalizedName = (
  value: LocalizedName | undefined,
  language: string
) => {
  if (!value) return ''

  if (language.startsWith('hy')) {
    return value.hy || value.arm || value.en || value.eng || value.ru || value.rus || ''
  }

  if (language.startsWith('ru')) {
    return value.ru || value.rus || value.en || value.eng || value.hy || value.arm || ''
  }

  return value.en || value.eng || value.hy || value.arm || value.ru || value.rus || ''
}

export const getCompareFilterGroups = (
  cities: PackageCity[],
  selectedCityIds: number[],
  language: string
): CompareFilterGroup[] => {
  const groups = new Map<number, {
    id: number
    title: string
    rowsMap: Map<number, CompareRow>
  }>()

  const selectedCityIdSet = new Set(selectedCityIds)
  const sourceCities =
    selectedCityIdSet.size === 0
      ? cities
      : cities.filter(city => selectedCityIdSet.has(city.id))

  sourceCities.forEach(city => {
    city.filters
      ?.filter(filter => filter.comparisonIncluded)
      .forEach(filter => {
        if (!groups.has(filter.id)) {
          groups.set(filter.id, {
            id: filter.id,
            title: getLocalizedName(filter.name, language),
            rowsMap: new Map()
          })
        }

        const group = groups.get(filter.id)
        if (!group) {
          return
        }

        filter.values.forEach(value => {
          const isCityRelevant =
            value.cityIds.length === 0 || value.cityIds.includes(city.id)

          if (!isCityRelevant || group.rowsMap.has(value.id)) {
            return
          }

          group.rowsMap.set(value.id, {
            key: `${filter.id}-${value.id}`,
            label: getLocalizedName(value.name, language),
            filterTitle: group.title,
            filterId: filter.id,
            valueId: value.id
          })
        })
      })
  })

  return Array.from(groups.values())
    .map(group => ({
      id: group.id,
      title: group.title,
      rows: Array.from(group.rowsMap.values()).sort((a, b) =>
        a.label.localeCompare(b.label)
      )
    }))
    .sort((a, b) => a.title.localeCompare(b.title))
}

export const isCompareFeatureAvailable = (
  cities: PackageCity[],
  selectedCityIds: number[],
  language: string
) => {
  const groups = getCompareFilterGroups(cities, selectedCityIds, language)
  return groups.some(group => group.rows.length > 0)
}

export const formatShortLocalizedDate = (
  rawDate: string | undefined,
  t: (key: string) => string
) => {
  if (!rawDate) return ''

  const date = new Date(rawDate)
  if (Number.isNaN(date.getTime())) return ''

  const longMonthName = date
    .toLocaleString('en-US', { month: 'long' })
    .toLowerCase()

  const shortMonthName = t(`${longMonthName}Short`)

  return `${shortMonthName} ${date.getDate()}`
}

export const getDateRange = (
  pack: PackageEntity,
  t: (key: string) => string
) => {
  const isHotelPackage = !pack.destinationFlight?.departureDate

  const startDate = isHotelPackage
    ? pack.checkin
    : pack.destinationFlight?.departureDate

  const endDate = isHotelPackage
    ? pack.checkout
    : pack.returnFlight?.departureDate || pack.returnFlight?.arrivalDate

  return [formatShortLocalizedDate(startDate, t), formatShortLocalizedDate(endDate, t)]
    .filter(Boolean)
    .join(' - ')
}

export const getCompareSummary = (
  pack: PackageEntity | undefined,
  t: (key: string) => string
) => {
  if (!pack) {
    return t('compare')
  }

  const adultsLabel = t(getPluralForm(pack.adultTravelers, 'adults')).toLowerCase()
  const nightsLabel = t(getPluralForm(pack.nights, 'nights')).toLowerCase()

  return `${getDateRange(pack, t)} | ${pack.adultTravelers} ${adultsLabel} • ${pack.nights} ${nightsLabel}`
}

export const hasComparedValue = (
  pack: PackageEntity,
  row: CompareRow
) => {
  const packageFilter = pack.filters?.find(filter => filter.id === row.filterId)

  if (!packageFilter) {
    return false
  }

  return packageFilter.values.some(value => {
    const isCityRelevant = value.cityIds.length === 0 || value.cityIds.includes(pack.city.id)
    return value.id === row.valueId && isCityRelevant
  })
}
