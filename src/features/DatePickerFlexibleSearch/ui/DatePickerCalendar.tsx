import React, { useState, useMemo, useEffect } from 'react'
import { Box, Flex, useMediaQuery } from '@chakra-ui/react'
import { type DatePickerCalendarProps } from './types'
import { DatePickerMonth } from './DatePickerMonth'
import { Text, Button } from '@ui'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { MONTHS_COUNT_TO_DISPLAY } from '@/entities/package/ui/ApproximateDatePicker/model/constants'

export const DatePickerCalendar = ({
  onDayClick,
  selectedFromDate,
  selectedToDate,
  isLoading
}: DatePickerCalendarProps) => {
  const [currentMonthDate, setCurrentMonthDate] = useState(moment().toDate())

  const isMobile = useMediaQuery('(max-width: 1280px)')[0]

  const maxMonthDate = useMemo(
    () => moment().add(MONTHS_COUNT_TO_DISPLAY, 'months').endOf('month').toDate(),
    []
  )

  const today = useMemo(() => moment().startOf('day'), [])
  const maxDate = useMemo(() => moment(maxMonthDate).startOf('day'), [maxMonthDate])

  // Validate and set current month based on selectedFromDate
  useEffect(() => {
    if (selectedFromDate) {
      const selectedDate = moment(selectedFromDate).startOf('day')
      // Only use selectedFromDate if it's within valid range (today to maxDate)
      if (selectedDate.isSameOrAfter(today, 'day') && selectedDate.isSameOrBefore(maxDate, 'day')) {
        setCurrentMonthDate(selectedFromDate)
      } else {
        // If selectedFromDate is invalid, reset to current month
        setCurrentMonthDate(moment().toDate())
      }
    } else {
      // If no selectedFromDate, default to current month
      setCurrentMonthDate(moment().toDate())
    }
  }, [selectedFromDate, today, maxDate])

  const handlePrevMonth = () => {
    const currentMonth = moment(currentMonthDate).startOf('month')
    const todayMonth = moment().startOf('month')
    if (currentMonth.isAfter(todayMonth, 'month')) {
      const prevMonthDate = moment(currentMonthDate)
        .subtract(1, 'month')
        .toDate()
      setCurrentMonthDate(prevMonthDate)
    }
  }

  const handleNextMonth = () => {
    const currentMonth = moment(currentMonthDate).startOf('month')
    const maxMonth = moment(maxMonthDate).startOf('month')
    if (currentMonth.isBefore(maxMonth, 'month')) {
      const nextMonth = moment(currentMonthDate).add(1, 'month').toDate()
      setCurrentMonthDate(nextMonth)
    }
  }

  const isPrevDisabled = useMemo(
    () => moment(currentMonthDate).startOf('month') <= moment().startOf('month'),
    [currentMonthDate]
  )

  const isNextDisabled = useMemo(
    () => moment(currentMonthDate).startOf('month') >= moment(maxMonthDate).startOf('month'),
    [currentMonthDate, maxMonthDate]
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
          // Render MONTHS_COUNT_TO_DISPLAY count of months stacked vertically on mobile
          Array.from({ length: MONTHS_COUNT_TO_DISPLAY }).map((_, index) => {
            const monthDate = moment(moment().toDate())
              .add(index, 'months')
              .toDate()

            return (
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
            )
          })
        ) : (
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
