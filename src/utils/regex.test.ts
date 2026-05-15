import { describe, expect, it } from 'vitest'
import { ALPHABETIC_REGEXP, ALPHABETIC_SPACE_REGEX, EMAIL_REGEXP, NUMERIC_REGEXP } from './regex'

describe('NUMERIC_REGEXP', () => {
  it('matches a string of digits within the specified length range', () => {
    expect(NUMERIC_REGEXP(3, 6).test('1234')).toBe(true)
  })

  it('rejects a string shorter than the minimum length', () => {
    expect(NUMERIC_REGEXP(4, 8).test('123')).toBe(false)
  })

  it('rejects a string longer than the maximum length', () => {
    expect(NUMERIC_REGEXP(2, 4).test('12345')).toBe(false)
  })

  it('rejects non-numeric characters', () => {
    expect(NUMERIC_REGEXP(1, 10).test('12a4')).toBe(false)
  })
})

describe('ALPHABETIC_SPACE_REGEX', () => {
  it('matches a string of letters and spaces', () => {
    expect(ALPHABETIC_SPACE_REGEX.test('Hello World')).toBe(true)
  })

  it('rejects strings containing digits', () => {
    expect(ALPHABETIC_SPACE_REGEX.test('Hello 1')).toBe(false)
  })

  it('rejects strings containing special characters', () => {
    expect(ALPHABETIC_SPACE_REGEX.test('Hello!')).toBe(false)
  })
})

describe('ALPHABETIC_REGEXP', () => {
  it('matches a string of letters within the specified length range', () => {
    expect(ALPHABETIC_REGEXP(2, 5).test('abc')).toBe(true)
  })

  it('rejects strings containing digits', () => {
    expect(ALPHABETIC_REGEXP(1, 10).test('abc1')).toBe(false)
  })

  it('rejects strings outside the length range', () => {
    expect(ALPHABETIC_REGEXP(4, 6).test('ab')).toBe(false)
  })
})

describe('EMAIL_REGEXP', () => {
  it('matches a valid email address', () => {
    expect(EMAIL_REGEXP.test('user@example.com')).toBe(true)
  })

  it('matches an email with subdomain', () => {
    expect(EMAIL_REGEXP.test('user@mail.example.co.uk')).toBe(true)
  })

  it('rejects an address without @', () => {
    expect(EMAIL_REGEXP.test('userexample.com')).toBe(false)
  })

  it('rejects an address without domain', () => {
    expect(EMAIL_REGEXP.test('user@')).toBe(false)
  })

  it('rejects an address without local part', () => {
    expect(EMAIL_REGEXP.test('@example.com')).toBe(false)
  })
})
