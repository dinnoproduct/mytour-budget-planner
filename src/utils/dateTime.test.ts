import { describe, expect, it } from 'vitest'
import { toLocalIsoString } from './dateTime'

describe('toLocalIsoString', () => {
  it('formats a date to ISO 8601 local time string', () => {
    const date = new Date(2024, 0, 15, 9, 5, 3) // Jan 15 2024, 09:05:03 local
    expect(toLocalIsoString(date)).toBe('2024-01-15T09:05:03')
  })

  it('pads single-digit month, day, hours, minutes, seconds with leading zeros', () => {
    const date = new Date(2024, 2, 4, 8, 7, 6) // Mar 4 2024, 08:07:06
    expect(toLocalIsoString(date)).toBe('2024-03-04T08:07:06')
  })

  it('handles end-of-year date correctly', () => {
    const date = new Date(2023, 11, 31, 23, 59, 59) // Dec 31 2023, 23:59:59
    expect(toLocalIsoString(date)).toBe('2023-12-31T23:59:59')
  })

  it('handles midnight correctly', () => {
    const date = new Date(2024, 5, 1, 0, 0, 0) // Jun 1 2024, 00:00:00
    expect(toLocalIsoString(date)).toBe('2024-06-01T00:00:00')
  })
})
