import { appendStoredUTMsToSearchParams } from '@/utils/utmParams'

/** Query keys only used on package/hotel detail (multivendor / room), not on the search list. */
const PACKAGE_DETAIL_ONLY_KEYS = ['hotelId', 'roomId', 'mealId'] as const

/**
 * Builds `/packages?...` search string from the current package detail URL so the list keeps
 * the same search (dates, city, travelers, flights, etc.) after a broken/invalid offer redirect.
 */
export function buildPackagesListQueryFromDetailsSearch(
  search: string,
  tab: 'packages' | 'hotel',
): string {
  const params = new URLSearchParams(search)
  PACKAGE_DETAIL_ONLY_KEYS.forEach(key => params.delete(key))
  params.set('tab', tab)
  appendStoredUTMsToSearchParams(params)
  return params.toString()
}
