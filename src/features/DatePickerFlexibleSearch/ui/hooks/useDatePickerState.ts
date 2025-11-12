import { useState, useEffect, useCallback } from 'react'
import { useHotelPackagesSearchContext } from '@/entities/package'
import type { DateModeType } from '@/entities/package'
import moment from 'moment'
import { MONTHS_COUNT_TO_DISPLAY } from '@/entities/package/ui/ApproximateDatePicker/model/constants'

interface UseDatePickerStateProps {
  fromDate?: Date | null
  toDate?: Date | null
  onAccept: (fromDate: Date, toDate?: Date | null, days?: number) => void
}

export const useDatePickerState = ({
  fromDate,
  toDate,
  onAccept
}: UseDatePickerStateProps) => {
  const [tabIndex, setTabIndex] = useState(0)
  const [selectedFromDate, setSelectedFromDate] = useState<Date | null>(null)
  const [selectedToDate, setSelectedToDate] = useState<Date | null>(null)
  const [isCalendarOpen, setCalendarOpen] = useState(false)
  const [inputFromDate, setInputFromDate] = useState<Date | null>(null)
  const [inputToDate, setInputToDate] = useState<Date | null>(null)
  const [days, setDays] = useState<number>()

  const { setDateMode, dateMode, searchData } = useHotelPackagesSearchContext()

  // Sync with external dates
  useEffect(() => {
    if (fromDate) {
      setSelectedFromDate(fromDate)
      setInputFromDate(fromDate)
    }

    if (toDate) {
      setSelectedToDate(toDate)
      setInputToDate(toDate)
    }

    if (searchData.days && dateMode === 'approximate') {
      setDays(searchData.days)
    } else {
      setDays(undefined)
    }
  }, [fromDate, toDate, dateMode, searchData.days])

  // Reset selected dates when calendar opens based on date mode
  useEffect(() => {
    if (isCalendarOpen) {
      if (dateMode === 'exact') {
        // Validate dates are within valid range when switching to exact dates
        const today = moment().startOf('day')
        const maxDate = moment().add(MONTHS_COUNT_TO_DISPLAY, 'months').endOf('month')

        // Only use inputFromDate if it's valid (today or future, within MONTHS_COUNT_TO_DISPLAY months)
        const isValidFromDate =
          inputFromDate &&
          moment(inputFromDate).startOf('day').isSameOrAfter(today, 'day') &&
          moment(inputFromDate).startOf('day').isSameOrBefore(maxDate, 'day')
        
        const isValidToDate =
          inputToDate &&
          moment(inputToDate).startOf('day').isSameOrAfter(today, 'day') &&
          moment(inputToDate).startOf('day').isSameOrBefore(maxDate, 'day')

        setSelectedFromDate(isValidFromDate ? inputFromDate : null)
        setSelectedToDate(isValidToDate ? inputToDate : null)
      } else {
        // For approximate mode, clear selected dates
        setSelectedFromDate(null)
        setSelectedToDate(null)
      }
    }
  }, [isCalendarOpen, inputFromDate, inputToDate, dateMode])

  const handleDayClick = useCallback((date: Date) => {
    if (!selectedFromDate || (selectedFromDate && selectedToDate)) {
      setSelectedFromDate(date)
      setSelectedToDate(null)
    } else if (selectedFromDate && !selectedToDate) {
      if (date < selectedFromDate) {
        setSelectedFromDate(date)
      } else {
        setSelectedToDate(date)
      }
    }
  }, [selectedFromDate, selectedToDate])

  const handleExactDateAccept = useCallback(() => {
    if (selectedFromDate && selectedToDate) {
      onAccept(selectedFromDate, selectedToDate)
      setInputFromDate(selectedFromDate)
      setInputToDate(selectedToDate)
      setDays(undefined)
      setDateMode('exact')
      setCalendarOpen(false)
    }
  }, [selectedFromDate, selectedToDate, onAccept, setDateMode])

  const handleApproximateAccept = useCallback(
    (data: { dateFrom: Date; dateTo: Date; days: number }) => {
      onAccept(data.dateFrom, data.dateTo, data.days)
      setInputFromDate(data.dateFrom)
      setInputToDate(data.dateTo)
      setDays(data.days)
      setDateMode('approximate')
      setCalendarOpen(false)
    },
    [onAccept, setDateMode]
  )

  const handleCalendarOpen = useCallback(() => {
    if (dateMode === 'approximate') {
      setTabIndex(1)
    } else {
      setTabIndex(0)
    }
    setCalendarOpen(true)
  }, [dateMode])

  const handleCalendarClose = useCallback(() => {
    setCalendarOpen(false)
  }, [])

  const handleTabChange = useCallback((index: number) => {
    setTabIndex(index)
    
    // When switching to exact dates tab (index 0), validate and reset dates
    if (index === 0) {
      const today = moment().startOf('day')
      const maxDate = moment().add(MONTHS_COUNT_TO_DISPLAY, 'months').endOf('month')

      // Validate dates are within valid range
      const isValidFromDate =
        inputFromDate &&
        moment(inputFromDate).startOf('day').isSameOrAfter(today, 'day') &&
        moment(inputFromDate).startOf('day').isSameOrBefore(maxDate, 'day')
      
      const isValidToDate =
        inputToDate &&
        moment(inputToDate).startOf('day').isSameOrAfter(today, 'day') &&
        moment(inputToDate).startOf('day').isSameOrBefore(maxDate, 'day')

      // Only set selected dates if they're valid, otherwise clear them
      setSelectedFromDate(isValidFromDate ? inputFromDate : null)
      setSelectedToDate(isValidToDate ? inputToDate : null)
    } else {
      // When switching to approximate tab, clear selected dates
      setSelectedFromDate(null)
      setSelectedToDate(null)
    }
  }, [inputFromDate, inputToDate])

  return {
    tabIndex,
    selectedFromDate,
    selectedToDate,
    isCalendarOpen,
    inputFromDate,
    inputToDate,
    days,
    dateMode,
    searchData,
    handleDayClick,
    handleExactDateAccept,
    handleApproximateAccept,
    handleCalendarOpen,
    handleCalendarClose,
    handleTabChange
  }
}

