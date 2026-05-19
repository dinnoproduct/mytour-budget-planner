import { describe, expect, it } from 'vitest'

import { approximateNumber, formatNumber } from './number'

describe('number utils', () => {
  describe('formatNumber', () => {
    it('formats positive numbers with thousand separators', () => {
      expect(formatNumber(1234567)).toBe('1,234,567')
    })

    it('formats zero correctly', () => {
      expect(formatNumber(0)).toBe('0')
    })
  })

  describe('approximateNumber', () => {
    it('rounds division result up', () => {
      expect(approximateNumber(10, 3)).toBe(4)
    })

    it('returns exact value when division has no remainder', () => {
      expect(approximateNumber(12, 3)).toBe(4)
    })
  })
})
