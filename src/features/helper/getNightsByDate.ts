import moment from 'moment'

const calculateNights = (
  fromDate: string | Date,
  toDate: string | Date,
  subtractOne = true
): number => {
  const start = moment(fromDate).startOf('day')
  const end = moment(toDate).startOf('day')
  const diff = end.diff(start, 'days')

  return Math.max(subtractOne ? diff - 1 : diff, 0)
}

export const getNightsByDate = (
  fromDate: string | Date,
  toDate: string | Date
): number => calculateNights(fromDate, toDate)

export const getHotelNightsByDate = (
  fromDate: string | Date,
  toDate: string | Date
): number => calculateNights(fromDate, toDate, false)
