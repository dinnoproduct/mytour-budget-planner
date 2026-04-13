export const MAX_TRAVELERS = 6

export type TravelersData = {
  adultsCount: number
  childrenCount: number
  childrenAges: number[]
}

export const normalizePhone = (value?: string) => {
  if (!value) return '+374'
  const sanitized = value.replace(/\s+/g, '')
  if (sanitized.startsWith('+374')) {
    return sanitized.slice(0, 12)
  }
  return `+374${sanitized.replace(/^\+/, '').slice(0, 8)}`
}

export const formatDate = (date: Date): string => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export const parseQueryDate = (value: string | null): Date | null => {
  if (!value) return null
  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime())) {
    return null
  }
  return parsedDate
}
