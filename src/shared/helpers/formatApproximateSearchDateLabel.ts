import { getPluralForm } from './getPluralForm'

type TranslateFn = (
  key: string,
  options?: Record<string, string | number>
) => string

export const formatApproximateSearchDateLabel = (
  fromDate: Date,
  days: number,
  t: TranslateFn
) => {
  const longMonthName = fromDate
    .toLocaleString('en-US', { month: 'long' })
    .toLowerCase()

  const month = t(longMonthName)

  return `${month.charAt(0).toUpperCase() + month.slice(1)}, ± ${t(
    getPluralForm(days, 'daysQuantity'),
    { day: days }
  )}`
}
