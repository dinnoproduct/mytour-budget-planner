import React, { useState, useMemo, useEffect } from 'react'
import { Box, Flex, useMediaQuery } from '@chakra-ui/react'
import { type DatePickerCalendarProps } from './types'
import { DatePickerMonth } from './DatePickerMonth'
import { Text, Button } from '@ui'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

const MAX_MONTHS = 6

export const DatePickerCalendar = ({
  onDayClick,
  selectedFromDate,
  selectedToDate,
  isLoading
}: DatePickerCalendarProps) => {
  const [currentMonthDate, setCurrentMonthDate] = useState(moment().toDate())

  useEffect(() => {
    if (selectedFromDate) {
      setCurrentMonthDate(selectedFromDate)
    }
  }, [selectedFromDate])

  const isMobile = useMediaQuery('(max-width: 1280px)')[0]

  const maxMonthDate = useMemo(
    () => moment().add(MAX_MONTHS, 'months').toDate(),
    []
  )

  const handlePrevMonth = () => {
    if (moment(currentMonthDate) > moment()) {
      const prevMonthDate = moment(currentMonthDate)
        .subtract(1, 'month')
        .toDate()
      setCurrentMonthDate(prevMonthDate)
    }
  }

  const handleNextMonth = () => {
    if (moment(currentMonthDate) < moment(maxMonthDate)) {
      const nextMonth = moment(currentMonthDate).add(1, 'month').toDate()
      setCurrentMonthDate(nextMonth)
    }
  }

  const isPrevDisabled = useMemo(
    () => moment(currentMonthDate) <= moment(),
    [currentMonthDate]
  )

  const isNextDisabled = useMemo(
    () => moment(currentMonthDate) >= moment(maxMonthDate),
    [currentMonthDate]
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
          // Render MAX_MONTHS count of months stacked vertically on mobile
          Array.from({ length: MAX_MONTHS }).map((_, index) => {
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
    .toLocaleString('default', { month: 'long' })
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
          size="sm"
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
          size="sm"
          isDisabled={isNextDisabled}
          display={{ base: 'none', md: 'inline-flex' }}
        />
      )}
    </Flex>
  )
}
