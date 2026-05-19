import { describe, expect, it } from 'vitest'

import { capitalize } from './string'

describe('string utils', () => {
  describe('capitalize', () => {
    it('capitalizes each word and lowercases remaining letters', () => {
      expect(capitalize('hELLo wORLD')).toBe('Hello World')
    })

    it('keeps single-word strings valid', () => {
      expect(capitalize('vacation')).toBe('Vacation')
    })

    it('handles multiple spaces consistently', () => {
      expect(capitalize('go   now')).toBe('Go   Now')
    })
  })
})
