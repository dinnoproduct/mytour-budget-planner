import React, { useState, useMemo, useEffect } from 'react'
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
  const startDate = useMemo(() => availableDates[0] || today, [availableDates])
  const [currentMonth, setCurrentMonth] = useState(today)
  useEffect(() => {
    setCurrentMonth(startDate)
  }, [startDate])

  useEffect(() => {
    if (selectedFromDate && dateSelectState === 'from') {
      setCurrentMonth(
        new Date(selectedFromDate.getFullYear(), selectedFromDate.getMonth(), 1)
      )
    } else if (availableDates.length > 0) {
      const earliestAvailableDate = new Date(availableDates[0])
      setCurrentMonth(
        new Date(
          earliestAvailableDate.getFullYear(),
          earliestAvailableDate.getMonth(),
          1
        )
      )
    } else if (selectedFromDate) {
      setCurrentMonth(
        new Date(selectedFromDate.getFullYear(), selectedFromDate.getMonth(), 1)
      )
    } else if (startDate) {
      setCurrentMonth(
        new Date(startDate.getFullYear(), startDate.getMonth(), 1)
      )
    } else {
      setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1))
    }
  }, [JSON.stringify(availableDates), startDate, selectedFromDate])

  const { isMd } = useBreakpoint()

  const maxDate = useMemo(() => {
    if (availableDates.length > 0) {
      const lastAvailableDate = moment(
        availableDates[availableDates.length - 1]
      ).startOf('month')

      return lastAvailableDate
    }

    return moment(today)
      .add(MAX_MONTHS - 2, 'months')
      .startOf('month')
  }, [availableDates, today])

  const handlePrevMonth = () => {
    if (currentMonth > new Date(today.getFullYear(), today.getMonth(), 1)) {
      const prevMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        1
      )
      setCurrentMonth(prevMonth)
    }
  }

  const handleNextMonth = () => {
    if (moment(currentMonth).isBefore(maxDate)) {
      const nextMonth = moment(currentMonth).add(1, 'month').toDate()
      setCurrentMonth(nextMonth)
    }
  }

  const isPrevDisabled = useMemo(() => {
    const minDate =
      startDate && moment(startDate).isAfter(today)
        ? moment(startDate).startOf('month')
        : moment(today).startOf('month')

    return moment(currentMonth).isSameOrBefore(minDate)
  }, [currentMonth, today, startDate])

  const isNextDisabled = useMemo(
    () => moment(currentMonth).isSameOrAfter(maxDate),
    [currentMonth, maxDate]
  )

  return (
    <Box
      width="full"
      // overflowY={{ base: 'scroll', md: 'unset' }}
      // height={{ base: 'calc(100% - 192px)', md: 'auto' }}
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
        size="sm"
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
        size="sm"
        isDisabled={isNextDisabled}
        display={{ base: 'none', md: 'inline-flex' }}
      />
    </Flex>
  )
}
