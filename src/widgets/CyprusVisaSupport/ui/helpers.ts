export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const ARMENIA_PHONE_REGEX = /^\+374\d{8}$/

export const normalizePhone = (value?: string) => {
  if (!value) {
    return '+374'
  }

  const digitsOnly = value.replace(/[^\d]/g, '')
  const localPart = digitsOnly.startsWith('374')
    ? digitsOnly.slice(3, 11)
    : digitsOnly.slice(0, 8)

  return `+374${localPart}`
}

export const normalizePhoneInput = (value: string) => {
  const digitsOnly = value.replace(/[^\d]/g, '')
  const localPart = digitsOnly.startsWith('374')
    ? digitsOnly.slice(3, 11)
    : digitsOnly.slice(0, 8)

  return `+374${localPart}`
}
