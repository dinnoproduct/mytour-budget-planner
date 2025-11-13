import { useMemo } from 'react'
import moment from 'moment'
import { MONTHS_COUNT_TO_DISPLAY } from '@/entities/package/ui/ApproximateDatePicker/model/constants'

/**
 * Shared hook for calculating month range and availability.
 * Used by both mobile and desktop views to ensure consistency.
 */
export const useMonthRange = () => {
  const today = useMemo(() => moment().startOf('day'), [])
  const startMonth = useMemo(() => moment().startOf('month'), [])
  
  const maxMonthDate = useMemo(
    () => moment().add(MONTHS_COUNT_TO_DISPLAY, 'months').endOf('month').toDate(),
    []
  )
  
  const maxMonth = useMemo(
    () => moment(maxMonthDate).startOf('month'),
    [maxMonthDate]
  )
  
  const maxDate = useMemo(
    () => moment(maxMonthDate).startOf('day'),
    [maxMonthDate]
  )

  // Calculate all available months (used by mobile view)
  const availableMonths = useMemo(() => {
    const months = []
    let currentMonth = startMonth.clone()
    
    while (currentMonth.isSameOrBefore(maxMonth, 'month')) {
      months.push(currentMonth.toDate())
      currentMonth.add(1, 'month')
    }
    
    return months
  }, [startMonth, maxMonth])

  // Check if a month is within the valid range
  const isMonthValid = (month: Date) => {
    const monthMoment = moment(month).startOf('month')
    return (
      monthMoment.isSameOrAfter(startMonth, 'month') &&
      monthMoment.isSameOrBefore(maxMonth, 'month')
    )
  }

  // Check if we can navigate to the previous month
  const canNavigatePrev = (currentMonth: Date) => {
    const currentMonthMoment = moment(currentMonth).startOf('month')
    return currentMonthMoment.isAfter(startMonth, 'month')
  }

  // Check if we can navigate to the next month
  const canNavigateNext = (currentMonth: Date) => {
    const currentMonthMoment = moment(currentMonth).startOf('month')
    return currentMonthMoment.isBefore(maxMonth, 'month')
  }

  return {
    today,
    startMonth: startMonth.toDate(),
    maxMonthDate,
    maxMonth: maxMonth.toDate(),
    maxDate: maxDate.toDate(),
    availableMonths,
    isMonthValid,
    canNavigatePrev,
    canNavigateNext
  }
}

