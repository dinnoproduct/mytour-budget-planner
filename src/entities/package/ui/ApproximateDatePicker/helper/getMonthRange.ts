import moment from 'moment'

export function getMonthRange(month: string) {
  const monthIndex = moment().month(month).month()
  const currentYear = moment().year()

  const startOfMonth = moment({ year: currentYear, month: monthIndex, day: 1 })
    .startOf('month')
    .toDate()
  const endOfMonth = moment({ year: currentYear, month: monthIndex, day: 1 })
    .endOf('month')
    .toDate()

  return { startOfMonth, endOfMonth }
}
