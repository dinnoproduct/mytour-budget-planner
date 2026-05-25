import { describe, expect, it } from 'vitest'
import {
  dateFormatter,
  formatDateAndTime,
  langKeyAdapter,
  numberWithCommaNormalizer,
  selectOptionNormalizer,
} from './normalizers'

describe('numberWithCommaNormalizer', () => {
  it('formats a large number with comma separators', () => {
    expect(numberWithCommaNormalizer(1000000)).toBe('1,000,000')
  })

  it('returns empty string for empty input', () => {
    expect(numberWithCommaNormalizer('')).toBe('')
  })

  it('returns the value unchanged for zero', () => {
    expect(numberWithCommaNormalizer(0)).toBe(0)
  })

  it('returns "-" unchanged', () => {
    expect(numberWithCommaNormalizer('-')).toBe('-')
  })

  it('returns null unchanged', () => {
    expect(numberWithCommaNormalizer(null as never)).toBe(null)
  })

  it('applies two decimal places when decimal option is true', () => {
    expect(numberWithCommaNormalizer(1234.567, { decimal: true })).toBe('1,234.57')
  })

  it('formats string numbers correctly', () => {
    expect(numberWithCommaNormalizer('5000')).toBe('5,000')
  })
})

describe('langKeyAdapter', () => {
  it('maps hy to Arm', () => {
    expect(langKeyAdapter['hy']).toBe('Arm')
  })

  it('maps en to Eng', () => {
    expect(langKeyAdapter['en']).toBe('Eng')
  })

  it('maps ru to Rus', () => {
    expect(langKeyAdapter['ru']).toBe('Rus')
  })
})

describe('selectOptionNormalizer', () => {
  const options = [
    { id: 1, nameArm: 'Երևan', nameEng: 'Yerevan', nameRus: 'Ереван' },
    { id: 2, nameArm: 'Գyumri', nameEng: 'Gyumri', nameRus: 'Гюмри' },
  ]

  it('maps Armenian language to nameArm label', () => {
    const result = selectOptionNormalizer(options as never, 'hy')
    expect(result[0]).toEqual({ value: 1, label: 'Երևan' })
  })

  it('maps English language to nameEng label', () => {
    const result = selectOptionNormalizer(options as never, 'en')
    expect(result[1]).toEqual({ value: 2, label: 'Gyumri' })
  })

  it('maps Russian language to nameRus label', () => {
    const result = selectOptionNormalizer(options as never, 'ru')
    expect(result[0]).toEqual({ value: 1, label: 'Ереван' })
  })
})

describe('dateFormatter', () => {
  it('formats a Date object as DD.MM.YYYY', () => {
    expect(dateFormatter(new Date(2024, 0, 5))).toBe('05.01.2024')
  })

  it('formats a date string as DD.MM.YYYY', () => {
    expect(dateFormatter('2024-12-25')).toBe('25.12.2024')
  })
})

describe('formatDateAndTime', () => {
  const date = new Date(2024, 5, 15, 9, 30, 45) // Jun 15 2024, 09:30:45

  it('returns YYYY-MM-DD by default', () => {
    expect(formatDateAndTime(date)).toBe('2024-06-15')
  })

  it('returns HH:MM when onlyTime is true', () => {
    expect(formatDateAndTime(date, { onlyTime: true })).toBe('09:30')
  })

  it('returns full ISO datetime when withTime is true', () => {
    expect(formatDateAndTime(date, { withTime: true })).toBe('2024-06-15T09:30:45')
  })

  it('formats a string date the same as a Date object', () => {
    expect(formatDateAndTime('2024-06-15')).toBe('2024-06-15')
  })
})
