import { MONTHS } from '@/shared/model'
import moment from 'moment'

export function getMonthsToDisplay(length = 12) {
  return Array.from({ length }, (_, i) => {
    const date = moment().add(i, 'months')

    return {
      name: MONTHS[date.month()],
      year: date.year()
    }
  })
}
