import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/utils/utmParams', () => ({
  appendStoredUTMsToSearchParams: vi.fn(),
}))

import { appendStoredUTMsToSearchParams } from '@/utils/utmParams'
import { buildPackagesListQueryFromDetailsSearch } from './packagesListNavigation'

describe('buildPackagesListQueryFromDetailsSearch', () => {
  beforeEach(() => vi.clearAllMocks())

  it('removes package-detail-only keys from the query string', () => {
    const search = '?hotelId=5&roomId=3&mealId=1&cityId=2'
    const result = buildPackagesListQueryFromDetailsSearch(search, 'packages')
    const params = new URLSearchParams(result)
    expect(params.has('hotelId')).toBe(false)
    expect(params.has('roomId')).toBe(false)
    expect(params.has('mealId')).toBe(false)
  })

  it('preserves non-detail keys', () => {
    const search = '?cityId=2&adults=2&hotelId=5'
    const result = buildPackagesListQueryFromDetailsSearch(search, 'packages')
    const params = new URLSearchParams(result)
    expect(params.get('cityId')).toBe('2')
    expect(params.get('adults')).toBe('2')
  })

  it('sets tab param to the provided value', () => {
    const result = buildPackagesListQueryFromDetailsSearch('', 'hotel')
    expect(new URLSearchParams(result).get('tab')).toBe('hotel')
  })

  it('calls appendStoredUTMsToSearchParams to append UTMs', () => {
    buildPackagesListQueryFromDetailsSearch('?cityId=1', 'packages')
    expect(appendStoredUTMsToSearchParams).toHaveBeenCalledTimes(1)
  })
})
