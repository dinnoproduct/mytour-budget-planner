import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Box, Flex, useMediaQuery } from '@chakra-ui/react'
import { type DatePickerCalendarProps } from './types'
import { DatePickerMonth } from './DatePickerMonth'
import { Text, Button } from '@ui'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { useMonthRange } from './hooks/useMonthRange'

export const DatePickerCalendar = ({
  onDayClick,
  selectedFromDate,
  selectedToDate,
  isLoading
}: DatePickerCalendarProps) => {
  const [currentMonthDate, setCurrentMonthDate] = useState(() => moment().startOf('month').toDate())
  const lastManuallySetMonthRef = useRef<Date | null>(null)
  const isInitialMountRef = useRef(true)
  const prevSelectedFromDateRef = useRef<Date | null | undefined>(selectedFromDate)

  const isMobile = useMediaQuery('(max-width: 1280px)')[0]

  // Use shared month range logic for both mobile and desktop
  // This ensures consistency: both views use the same calculation for month availability
  const {
    today,
    startMonth,
    maxMonthDate,
    maxMonth,
    maxDate,
    availableMonths
  } = useMonthRange()

  // Only update currentMonthDate from selectedFromDate on initial mount or when selectedFromDate changes externally
  // Don't reset when user is navigating manually
  useEffect(() => {
    // Check if selectedFromDate actually changed (by value, not just reference)
    const selectedDateChanged = 
      prevSelectedFromDateRef.current !== selectedFromDate &&
      (prevSelectedFromDateRef.current === null || 
       selectedFromDate === null || 
       !moment(prevSelectedFromDateRef.current).isSame(selectedFromDate, 'day'))
    
    // If selectedFromDate hasn't changed, don't do anything
    if (!selectedDateChanged && !isInitialMountRef.current) {
      return
    }

    // On initial mount, set to selectedFromDate or current month
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false
      if (selectedFromDate) {
        const selectedDate = moment(selectedFromDate).startOf('day')
        const todayMoment = moment().startOf('day')
        const maxDateMoment = moment(maxMonthDate).startOf('day')
        if (selectedDate.isSameOrAfter(todayMoment, 'day') && selectedDate.isSameOrBefore(maxDateMoment, 'day')) {
          setCurrentMonthDate(selectedFromDate)
          prevSelectedFromDateRef.current = selectedFromDate
          return
        }
      }
      setCurrentMonthDate(startMonth)
      prevSelectedFromDateRef.current = selectedFromDate
      return
    }

    // After initial mount, if user has manually navigated, preserve the manually set month
    // Only update if selectedFromDate changed to a different month
    if (lastManuallySetMonthRef.current && selectedDateChanged) {
      if (selectedFromDate) {
        const selectedDate = moment(selectedFromDate).startOf('day')
        const todayMoment = moment().startOf('day')
        const maxDateMoment = moment(maxMonthDate).startOf('day')
        
        // Only update if the new selectedFromDate is in a different month than what we're showing
        const manuallySetMonth = moment(lastManuallySetMonthRef.current).startOf('month')
        const selectedMonth = moment(selectedFromDate).startOf('month')
        
        if (selectedDate.isSameOrAfter(todayMoment, 'day') && 
            selectedDate.isSameOrBefore(maxDateMoment, 'day') &&
            !selectedMonth.isSame(manuallySetMonth, 'month')) {
          // Only update if the selected date is in a completely different month
          setCurrentMonthDate(selectedFromDate)
          lastManuallySetMonthRef.current = null
        }
      }
      prevSelectedFromDateRef.current = selectedFromDate
      return
    }

    // Update from selectedFromDate only if it exists and is valid and changed
    // This happens when selectedFromDate changes externally (from parent component)
    if (selectedDateChanged && selectedFromDate) {
      const selectedDate = moment(selectedFromDate).startOf('day')
      const todayMoment = moment().startOf('day')
      const maxDateMoment = moment(maxMonthDate).startOf('day')
      if (selectedDate.isSameOrAfter(todayMoment, 'day') && selectedDate.isSameOrBefore(maxDateMoment, 'day')) {
        // Use functional update to avoid needing currentMonthDate in dependencies
        setCurrentMonthDate(prevMonthDate => {
          const currentMonthMoment = moment(prevMonthDate).startOf('month')
          const selectedMonthMoment = moment(selectedFromDate).startOf('month')
          // Only update if the month actually changed
          if (!currentMonthMoment.isSame(selectedMonthMoment, 'month')) {
            return selectedFromDate
          }
          return prevMonthDate
        })
      }
    }
    prevSelectedFromDateRef.current = selectedFromDate
  }, [selectedFromDate, today, maxDate, startMonth, maxMonthDate])

  const handlePrevMonth = () => {
    const currentMonthMoment = moment(currentMonthDate).startOf('month')
    const startMonthMoment = moment(startMonth).startOf('month')
    if (currentMonthMoment.isAfter(startMonthMoment, 'month')) {
      const prevMonthDate = moment(currentMonthDate)
        .subtract(1, 'month')
        .toDate()
      lastManuallySetMonthRef.current = prevMonthDate
      setCurrentMonthDate(prevMonthDate)
    }
  }

  const handleNextMonth = () => {
    const currentMonthMoment = moment(currentMonthDate).startOf('month')
    const maxMonthMoment = moment(maxMonth).startOf('month')
    if (currentMonthMoment.isBefore(maxMonthMoment, 'month')) {
      const nextMonth = moment(currentMonthDate).add(1, 'month').toDate()
      lastManuallySetMonthRef.current = nextMonth
      setCurrentMonthDate(nextMonth)
    }
  }

  const isPrevDisabled = useMemo(
    () => {
      const currentMonthMoment = moment(currentMonthDate).startOf('month')
      const startMonthMoment = moment(startMonth).startOf('month')
      return !currentMonthMoment.isAfter(startMonthMoment, 'month')
    },
    [currentMonthDate, startMonth]
  )

  const isNextDisabled = useMemo(
    () => {
      const currentMonthMoment = moment(currentMonthDate).startOf('month')
      const maxMonthMoment = moment(maxMonth).startOf('month')
      return !currentMonthMoment.isBefore(maxMonthMoment, 'month')
    },
    [currentMonthDate, maxMonth]
  )

  return (
    <Box
      width="full"
      overflowY={{ base: 'scroll', md: 'unset' }}
      height={{ base: 'calc(100% - 84px)', md: 'auto' }}
      sx={{
        '&::-webkit-scrollbar': {
          width: '0'
        }
      }}
    >
      <Flex
        alignItems={{ base: 'center', md: 'flex-start' }}
        direction={{ base: 'column', md: 'row' }}
        pb="4"
        pt="0"
      >
        {isMobile ? (
          // Mobile: Render all available months stacked vertically for scrolling
          // Uses the same availableMonths array from shared useMonthRange hook
          availableMonths.map((monthDate, index) => (
            <Box key={index} pt="4" px="4">
              <MonthHeader month={monthDate} />

              <DatePickerMonth
                currentMonth={monthDate}
                isLoading={isLoading}
                onDayClick={onDayClick}
                selectedFromDate={selectedFromDate}
                selectedToDate={selectedToDate}
                maxDate={maxMonthDate}
              />
            </Box>
          ))
        ) : (
          // Desktop: Show one month at a time with navigation buttons
          // Uses the same maxMonthDate and navigation logic from shared useMonthRange hook
          <Box pt="4" px="4">
            <MonthHeader
              month={currentMonthDate}
              onPrevClick={handlePrevMonth}
              onNextClick={handleNextMonth}
              isPrevDisabled={isPrevDisabled}
              isNextDisabled={isNextDisabled}
            />

            <DatePickerMonth
              currentMonth={currentMonthDate}
              isLoading={isLoading}
              onDayClick={onDayClick}
              selectedFromDate={selectedFromDate}
              selectedToDate={selectedToDate}
              maxDate={maxMonthDate}
            />
          </Box>
        )}
      </Flex>
    </Box>
  )
}

const MonthHeader = ({
  month,
  isNextDisabled,
  isPrevDisabled,
  onNextClick,
  onPrevClick
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

  return (
    <Flex
      width="full"
      justify="space-between"
      mb="4"
      align="center"
      // pl={{ md: '8' }}
      // pr={{ md: '8' }}
    >
      {onPrevClick && (
        <Button
          onClick={() => onPrevClick()}
          icon="chevron-left"
          variant="solid-gray"
          size="lg"
          isDisabled={isPrevDisabled}
          display={{ base: 'none', md: 'inline-flex' }}
        />
      )}

      <Text size="md" color="gray.800" align="center" flexGrow="1">
        {t(monthName)}
      </Text>

      {onNextClick && (
        <Button
          onClick={() => onNextClick()}
          icon="chevron-right"
          variant="solid-gray"
          size="lg"
          isDisabled={isNextDisabled}
          display={{ base: 'none', md: 'inline-flex' }}
        />
      )}
    </Flex>
  )
}
