import { type FilterParams } from '../model'

export const FILTER_QUERY_KEYS = {
  HOTELS: 'fh',
  STARS: 'fs',
  PRICE_MIN: 'fmin',
  PRICE_MAX: 'fmax',
  CITY_FILTERS: 'fcf'
} as const

export const serializeCityFilterValues = (
  cityFilterValues: Record<string, number[]>
): string =>
  Object.entries(cityFilterValues)
    .filter(([, values]) => values.length > 0)
    .map(([filterId, values]) => `${filterId}:${values.join(',')}`)
    .join(';')

export const parseCityFilterValues = (
  serializedCityFilterValues: string | null
): Record<string, number[]> => {
  if (!serializedCityFilterValues) {
    return {}
  }

  return serializedCityFilterValues
    .split(';')
    .filter(Boolean)
    .reduce<Record<string, number[]>>((acc, chunk) => {
      const [filterId, serializedValues] = chunk.split(':')
      if (!filterId || !serializedValues) {
        return acc
      }

      const values = serializedValues
        .split(',')
        .map(value => Number(value))
        .filter(value => !Number.isNaN(value))

      if (values.length > 0) {
        acc[filterId] = values
      }

      return acc
    }, {})
}

export const parseFilterParamsFromSearch = (
  search: string
): FilterParams => {
  const params = new URLSearchParams(search)
  const hotelNames =
    params.get(FILTER_QUERY_KEYS.HOTELS)?.split(',').filter(Boolean) || []
  const hotelStars =
    params.get(FILTER_QUERY_KEYS.STARS)
      ?.split(',')
      .map(star => Number(star))
      .filter(star => !Number.isNaN(star)) || []
  const priceMin = Number(params.get(FILTER_QUERY_KEYS.PRICE_MIN) || '0')
  const priceMax = Number(params.get(FILTER_QUERY_KEYS.PRICE_MAX) || '0')
  const cityFilterValues = parseCityFilterValues(
    params.get(FILTER_QUERY_KEYS.CITY_FILTERS)
  )

  return {
    priceRange: {
      minValue: Number.isNaN(priceMin) ? 0 : priceMin,
      maxValue: Number.isNaN(priceMax) ? 0 : priceMax
    },
    packageSelectHotel: hotelNames,
    hotelRatingSelect: hotelStars,
    cityFilterValues
  }
}

export const mergeFilterParamsIntoSearch = (
  search: string,
  filterParams: FilterParams
): URLSearchParams => {
  const next = new URLSearchParams(search)
  next.delete(FILTER_QUERY_KEYS.HOTELS)
  next.delete(FILTER_QUERY_KEYS.STARS)
  next.delete(FILTER_QUERY_KEYS.PRICE_MIN)
  next.delete(FILTER_QUERY_KEYS.PRICE_MAX)
  next.delete(FILTER_QUERY_KEYS.CITY_FILTERS)

  if (filterParams.packageSelectHotel.length > 0) {
    next.set(FILTER_QUERY_KEYS.HOTELS, filterParams.packageSelectHotel.join(','))
  }

  if (filterParams.hotelRatingSelect.length > 0) {
    next.set(FILTER_QUERY_KEYS.STARS, filterParams.hotelRatingSelect.join(','))
  }

  if (filterParams.priceRange.minValue > 0) {
    next.set(FILTER_QUERY_KEYS.PRICE_MIN, String(filterParams.priceRange.minValue))
  }

  if (filterParams.priceRange.maxValue > 0) {
    next.set(FILTER_QUERY_KEYS.PRICE_MAX, String(filterParams.priceRange.maxValue))
  }

  const serializedCityFilters = serializeCityFilterValues(
    filterParams.cityFilterValues
  )
  if (serializedCityFilters) {
    next.set(FILTER_QUERY_KEYS.CITY_FILTERS, serializedCityFilters)
  }

  return next
}
