import { describe, expect, it } from 'vitest'
import { calculateAge, fmt, getDateMinusDays, overDaysFromNow, paginateData } from './methods'

describe('paginateData', () => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  it('returns the correct slice for page 1', () => {
    expect(paginateData(data, 1, 3)).toEqual([1, 2, 3])
  })

  it('returns the correct slice for page 2', () => {
    expect(paginateData(data, 2, 3)).toEqual([4, 5, 6])
  })

  it('returns remaining items on the last partial page', () => {
    expect(paginateData(data, 4, 3)).toEqual([10])
  })

  it('returns empty array when page is beyond data length', () => {
    expect(paginateData(data, 10, 3)).toEqual([])
  })
})

describe('calculateAge', () => {
  it('returns correct age when birthday already passed this year', () => {
    const today = new Date()
    const birthDate = new Date(today.getFullYear() - 30, today.getMonth() - 1, today.getDate())
    expect(calculateAge(birthDate)).toBe(30)
  })

  it('returns one less when birthday has not occurred yet this year', () => {
    const today = new Date()
    const birthDate = new Date(today.getFullYear() - 25, today.getMonth() + 1, today.getDate())
    expect(calculateAge(birthDate)).toBe(24)
  })
})

describe('overDaysFromNow', () => {
  it('returns true when the date is at or beyond the threshold in the future', () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 5)
    expect(overDaysFromNow(futureDate, 5)).toBe(true)
  })

  it('returns false when the date is before the threshold', () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 3)
    expect(overDaysFromNow(futureDate, 5)).toBe(false)
  })

  it('accepts a date string', () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 10)
    expect(overDaysFromNow(futureDate.toISOString(), 7)).toBe(true)
  })
})

describe('getDateMinusDays', () => {
  it('subtracts the given number of days from a Date object', () => {
    const date = new Date(2024, 5, 10) // Jun 10
    const result = getDateMinusDays(date, 5)
    expect(result.getDate()).toBe(5)
    expect(result.getMonth()).toBe(5)
    expect(result.getFullYear()).toBe(2024)
  })

  it('accepts a date string and returns a date 10 days earlier', () => {
    const input = new Date('2024-06-10')
    const result = getDateMinusDays('2024-06-10', 10)
    const expectedMs = input.getTime() - 10 * 24 * 60 * 60 * 1000
    expect(result.getTime()).toBe(expectedMs)
  })
})

describe('fmt', () => {
  it('returns empty string for null', () => {
    expect(fmt(null)).toBe('')
  })

  it('returns empty string for undefined', () => {
    expect(fmt(undefined)).toBe('')
  })

  it('slices a date string to first 10 characters', () => {
    expect(fmt('2024-07-15T10:30:00')).toBe('2024-07-15')
  })

  it('formats a Date object as YYYY-MM-DD', () => {
    expect(fmt(new Date(2024, 0, 5))).toBe('2024-01-05')
  })
})
