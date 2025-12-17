import moment from 'moment'
import { MONTHS } from '@/shared/model'
import { MONTHS_COUNT_TO_DISPLAY } from '../model/constants'

export function getMonthRange(month: string) {
  // Find the month in the available months list to get the correct year
  // This ensures that if we're in November 2025 and select "January",
  // we get January 2026, not January 2025
  const today = moment()
  
  // Get the list of available months from today (same as getMonthsToDisplay)
  const monthsToDisplay = Array.from({ length: MONTHS_COUNT_TO_DISPLAY }, (_, i) => {
    const date = today.clone().add(i, 'months')
    return {
      monthIndex: date.month(),
      year: date.year(),
      monthName: MONTHS[date.month()]
    }
  })
  
  // Find the month in the available months list to get the correct year
  const selectedMonthData = monthsToDisplay.find(m => m.monthName === month)
  
  if (selectedMonthData) {
    const startOfMonth = moment({ 
      year: selectedMonthData.year, 
      month: selectedMonthData.monthIndex, 
      day: 1 
    }).startOf('month').toDate()
    
    const endOfMonth = moment({ 
      year: selectedMonthData.year, 
      month: selectedMonthData.monthIndex, 
      day: 1 
    }).endOf('month').toDate()
    
    return { startOfMonth, endOfMonth }
  }
  
  // Fallback: if month not found in available months, use current year
  // This shouldn't happen, but provides a safety check
  const currentYear = moment().year()
  const fallbackMonthIndex = moment().month(month).month()
  
  const startOfMonth = moment({ year: currentYear, month: fallbackMonthIndex, day: 1 })
    .startOf('month')
    .toDate()
  const endOfMonth = moment({ year: currentYear, month: fallbackMonthIndex, day: 1 })
    .endOf('month')
    .toDate()

  return { startOfMonth, endOfMonth }
}
