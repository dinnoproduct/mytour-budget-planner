import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { type DatePickerCalendarProps } from './types'
import { DatePickerMonth } from './DatePickerMonth'
import { Text, Button } from '@ui'
import { useTranslation } from 'react-i18next'
import { useBreakpoint } from '@shared/hooks'
import { LoadingView } from '@features/DatePickerFlights/ui/LoadingView.tsx'
import moment from 'moment'

const MAX_MONTHS = 8

export const DatePickerCalendar = ({
  availableDates,
  onDayClick,
  selectedFromDate,
  selectedToDate,
  isLoading,
  dateSelectState
}: DatePickerCalendarProps) => {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(() => {
    // Initialize with first available date or today
    const initialDate = availableDates[0] || today
    return new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)
  })
  
  // Create stable keys for dependency array
  const availableDatesLength = availableDates.length
  const firstAvailableDateKey = useMemo(() => {
    if (availableDates.length === 0) return null
    const firstDate = availableDates[0]
    return firstDate ? firstDate.getTime() : null
  }, [availableDatesLength, availableDates[0]?.getTime()])
  
  const selectedFromDateKey = selectedFromDate ? selectedFromDate.getTime() : null
  
  // Track previous values to avoid unnecessary updates
  const prevAvailableDatesLengthRef = useRef<number>(availableDatesLength)
  const prevFirstAvailableDateKeyRef = useRef<number | null>(firstAvailableDateKey)
  const prevSelectedFromDateKeyRef = useRef<number | null>(selectedFromDateKey)
  const prevDateSelectStateRef = useRef(dateSelectState)
  
  useEffect(() => {
    // Check if availableDates actually changed (by length and first date key)
    const availableDatesChanged = 
      prevAvailableDatesLengthRef.current !== availableDatesLength ||
      prevFirstAvailableDateKeyRef.current !== firstAvailableDateKey
    
    // Check if selectedFromDate actually changed (by key)
    const selectedFromDateChanged = 
      prevSelectedFromDateKeyRef.current !== selectedFromDateKey
    
    // Check if dateSelectState changed
    const dateSelectStateChanged = prevDateSelectStateRef.current !== dateSelectState
    
    // Only proceed if something actually changed
    if (!availableDatesChanged && !selectedFromDateChanged && !dateSelectStateChanged) {
      return
    }
    
    // Update refs
    prevAvailableDatesLengthRef.current = availableDatesLength
    prevFirstAvailableDateKeyRef.current = firstAvailableDateKey
    prevSelectedFromDateKeyRef.current = selectedFromDateKey
    prevDateSelectStateRef.current = dateSelectState
    
    // Compute startDate inside effect
    const startDate = availableDates.length > 0 ? availableDates[0] : today
    
    // Determine which month to show
    let newMonth: Date
    
    if (selectedFromDate && dateSelectState === 'from') {
      newMonth = new Date(selectedFromDate.getFullYear(), selectedFromDate.getMonth(), 1)
    } else if (availableDates.length > 0) {
      newMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
    } else if (selectedFromDate) {
      newMonth = new Date(selectedFromDate.getFullYear(), selectedFromDate.getMonth(), 1)
    } else {
      newMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    }
    
    // Only update if the month actually changed (compare with current state)
    setCurrentMonth(prevMonth => {
      const prevMonthMoment = moment(prevMonth).startOf('month')
      const newMonthMoment = moment(newMonth).startOf('month')
      // Only update if the month actually changed
      if (!prevMonthMoment.isSame(newMonthMoment, 'month')) {
        return newMonth
      }
      return prevMonth
    })
  }, [selectedFromDateKey, dateSelectState, today, availableDatesLength, firstAvailableDateKey])

  const { isMd } = useBreakpoint()

  const maxDate = useMemo(() => {
    if (availableDates.length > 0) {
      const lastAvailableDate = moment(
        availableDates[availableDates.length - 1]
      ).endOf('month')

      return lastAvailableDate
    }

    return moment(today)
      .add(MAX_MONTHS - 2, 'months')
      .endOf('month')
  }, [availableDates, today])

  const handlePrevMonth = () => {
    const startDate = availableDates[0] || today
    const minDate = startDate && moment(startDate).isAfter(today)
      ? moment(startDate).startOf('month')
      : moment(today).startOf('month')
    
    if (moment(currentMonth).isAfter(minDate, 'month')) {
      const prevMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        1
      )
      setCurrentMonth(prevMonth)
    }
  }

  const handleNextMonth = () => {
    if (moment(currentMonth).isBefore(maxDate, 'month')) {
      const nextMonth = moment(currentMonth).add(1, 'month').toDate()
      setCurrentMonth(nextMonth)
    }
  }

  const isPrevDisabled = useMemo(() => {
    const startDate = availableDates[0] || today
    const minDate =
      startDate && moment(startDate).isAfter(today)
        ? moment(startDate).startOf('month')
        : moment(today).startOf('month')

    return moment(currentMonth).isSameOrBefore(minDate, 'month')
  }, [currentMonth, today, availableDates])

  const isNextDisabled = useMemo(
    () => moment(currentMonth).isSameOrAfter(maxDate, 'month'),
    [currentMonth, maxDate]
  )

  return (
    <Box
      width="full"
      overflowY={{ base: 'scroll', md: 'unset' }}
      height={{ base: 'calc(100% - 192px)', md: 'auto' }}
    >
      <Flex
        alignItems={{ base: 'center', md: 'flex-start' }}
        direction={{ base: 'column', md: 'row' }}
        px={{ md: 4 }}
        pb="4"
      >
        {isLoading ? (
          <LoadingView />
        ) : !isMd ? (
          Array.from({ length: MAX_MONTHS }).map((_, index) => {
            const startDate = availableDates[0] || today
            const monthDate = new Date(
              startDate ? startDate.getFullYear() : currentMonth.getFullYear(),
              startDate
                ? startDate.getMonth() + index
                : currentMonth.getMonth() + index,
              1
            )

            return (
              <Box key={index} pt="4" px="4">
                <MonthHeader month={monthDate} />

                <DatePickerMonth
                  currentMonth={monthDate}
                  availableDates={availableDates}
                  isLoading={isLoading}
                  onDayClick={onDayClick}
                  selectedFromDate={selectedFromDate}
                  selectedToDate={selectedToDate}
                  dateSelectState={dateSelectState}
                />
              </Box>
            )
          })
        ) : (
          <>
            <Box pt="4" px="4">
              <MonthHeader
                month={currentMonth}
                onPrevClick={handlePrevMonth}
                onNextClick={handleNextMonth}
                isPrevDisabled={isPrevDisabled}
                isNextDisabled={isNextDisabled}
              />

              <DatePickerMonth
                currentMonth={currentMonth}
                availableDates={availableDates}
                isLoading={isLoading}
                onDayClick={onDayClick}
                selectedFromDate={selectedFromDate}
                selectedToDate={selectedToDate}
                dateSelectState={dateSelectState}
              />
            </Box>
          </>
        )}
      </Flex>
    </Box>
  )
}

const MonthHeader = ({
  month,
  onPrevClick,
  onNextClick,
  isPrevDisabled,
  isNextDisabled
}: {
  month: Date
  onPrevClick?: () => void
  onNextClick?: () => void
  isPrevDisabled?: boolean
  isNextDisabled?: boolean
}) => {
  const { t } = useTranslation()

  const monthName = month
    .toLocaleString('en-US', { month: 'long' })
    .toLowerCase()
  const year = month.getFullYear()

  return (
    <Flex width="full" justify="space-between" mb="4" align="center">
      <Button
        onClick={() => onPrevClick && onPrevClick()}
        icon="chevron-left"
        variant="solid-gray"
        size="lg"
        isDisabled={isPrevDisabled}
        display={{ base: 'none', md: 'inline-flex' }}
      />

      <Text size="md" color="gray.800" align="center" flexGrow="1">
        {`${t(monthName)} ${year}`}
      </Text>

      <Button
        onClick={() => onNextClick && onNextClick()}
        icon="chevron-right"
        variant="solid-gray"
        size="lg"
        isDisabled={isNextDisabled}
        display={{ base: 'none', md: 'inline-flex' }}
      />
    </Flex>
  )
}
