import type { GroupTourName, GroupTourRouteItem, GroupTourDeparture, GroupTourRoomType } from '@entities/package'
import { t } from 'i18next'
import moment from 'moment'

export type RoomTypeKind = 'single' | 'double' | 'twin' | 'triple' | 'other'

/** Infer room type kind from localized name (e.g. Single, Double, Twin, Triple) for validation rules */
export const getRoomTypeKind = (room: GroupTourRoomType, lang: string): RoomTypeKind => {
  const name = room.name.eng?.toLowerCase().trim()
  if (!name) return 'other'
  if (name.includes('single')) return 'single'
  if (name.includes('double')) return 'double'
  if (name.includes('twin')) return 'twin'
  if (name.includes('triple')) return 'triple'
  return 'other'
}

const TIMEZONE = 'Asia/Yerevan'

/** Today's date string (YYYY-MM-DD) in Asia/Yerevan */
export const getTodayInYerevan = (): string =>
  new Date().toLocaleDateString('en-CA', { timeZone: TIMEZONE })

/** Departure is valid only if: availableSeats > 0, startDate >= today, bookingDeadline >= today (Asia/Yerevan) */
export const getValidDepartures = (departures: GroupTourDeparture[] = []): GroupTourDeparture[] => {
  const today = getTodayInYerevan() // 'YYYY-MM-DD' in Asia/Yerevan

  return departures.filter((d) => {
    const seatsOk = (d.availableSeats ?? 0) > 0

    const startDateStr = d.startDate?.slice(0, 10) // handle ISO strings like '2026-04-07T00:00:00'
    const startOk = !!startDateStr && startDateStr >= today

    const bookingDeadlineStr = d.bookingDeadline?.slice(0, 10) || null
    // If backend doesn't provide bookingDeadline, don't block the departure
    const bookingOk = !bookingDeadlineStr || bookingDeadlineStr >= today

    return seatsOk && startOk && bookingOk
  })
}

export const getLocalized = (obj: GroupTourName | undefined, lang: string) =>
  obj?.[lang as keyof GroupTourName] || obj?.eng || ''

export const getLocalizedRouteItem = (obj: GroupTourRouteItem | undefined | string, lang: string): string => {
  if (typeof obj === 'string') return obj
  if (!obj) return ''
  return obj[lang as keyof GroupTourRouteItem] || obj.eng || ''
}

export const formatDate = (dateStr?: string) => {
  if (!dateStr) return '—'
  return moment(dateStr).format('DD MMM YYYY')
}

export const getDepartureMonthName = (dateStr: string | undefined): string => {
  if (!dateStr) return ''
  const monthName = moment(dateStr).locale("en").format('MMMM').toLowerCase()
  const translatedMonthName = t(`${monthName}Short`)
  return translatedMonthName
}

export const getDepartureDay = (dateStr: string | undefined): string => {
  if (!dateStr) return ''
  return moment(dateStr).format('D')
}