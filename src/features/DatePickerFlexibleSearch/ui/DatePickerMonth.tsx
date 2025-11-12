import React, { useMemo } from 'react'
import { Box, SimpleGrid, Button } from '@chakra-ui/react'
import { type DateButtonProps, type DatePickerMonthProps } from './types'
import { Text } from '@ui'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { MONTHS_COUNT_TO_DISPLAY } from '@/entities/package/ui/ApproximateDatePicker/model/constants'

export const DatePickerMonth = ({
  currentMonth,
  onDayClick,
  selectedFromDate,
  selectedToDate,
  maxDate
}: DatePickerMonthProps) => {
  const { t } = useTranslation()
  const startOfMonth = useMemo(
    () => moment(currentMonth).startOf('month').toDate(),
    [currentMonth]
  )
  const endOfMonth = useMemo(
    () => moment(currentMonth).endOf('month').toDate(),
    [currentMonth]
  )

  const maxDateValue = useMemo(
    () => maxDate || moment().add(MONTHS_COUNT_TO_DISPLAY, 'months').endOf('month').toDate(),
    [maxDate]
  )

  const daysInMonth = []

  for (let i = startOfMonth.getDay(); i > 0; i--) {
    daysInMonth.push(null) // Padding days from the previous month
  }

  for (let day = 1; day <= endOfMonth.getDate(); day++) {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    )
    daysInMonth.push(date)
  }

  return (
    <Box>
      <SimpleGrid columns={7} spacing="4px" mb="4">
        {['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map(day => (
          <Text key={day} size="xs" align="center" color="gray.500">
            {t(day)}
          </Text>
        ))}
      </SimpleGrid>

      <SimpleGrid columns={7} spacing="4px">
        {daysInMonth.map((date, index) => {
          if (!date) {
            return <Box key={index} /> // Empty box for padding
          }

          const isSelected =
            (selectedFromDate &&
              moment(date).isSame(selectedFromDate, 'day')) ||
            (selectedToDate && moment(date).isSame(selectedToDate, 'day'))
          const isInRange =
            selectedFromDate &&
            selectedToDate &&
            moment(date).isBetween(
              selectedFromDate,
              selectedToDate,
              'day',
              '()'
            )

          const today = moment().startOf('day')
          const isPastDate = moment(date) < today
          const isFutureDate = moment(date) > moment(maxDateValue)
          const isAvailable = !isPastDate && !isFutureDate

          return (
            <DateButton
              key={index}
              date={date}
              isSelected={!!isSelected}
              isInRange={!!isInRange}
              onClick={onDayClick}
              isAvailable={isAvailable}
            />
          )
        })}
      </SimpleGrid>
    </Box>
  )
}

const DateButton = ({
  date,
  isAvailable,
  isSelected,
  isInRange,
  isLoading,
  onClick,
  ...props
}: DateButtonProps) => (
  <Button
    onClick={() => isAvailable && onClick(date)}
    isDisabled={!isAvailable || isLoading}
    border="1px solid"
    borderColor={
      isSelected
        ? 'blue.500'
        : isInRange
          ? 'blue.50'
          : isAvailable
            ? 'gray.400'
            : 'transparent'
    }
    bgColor={
      isSelected
        ? 'blue.500'
        : isInRange
          ? 'blue.50'
          : isAvailable
            ? 'white'
            : 'blackAlpha.50'
    }
    color={
      isSelected
        ? 'white'
        : isInRange
          ? 'blue.500'
          : isAvailable
            ? 'gray.500'
            : 'blackAlpha.300'
    }
    rounded="base"
    height="48px"
    width="48px"
    fontSize="text-xs"
    lineHeight="text-xs"
    _hover={{
      borderColor: isSelected
        ? 'blue.500'
        : isInRange
          ? 'blue.50'
          : isAvailable
            ? 'gray.400'
            : 'transparent',
      bgColor: isSelected
        ? 'blue.500'
        : isInRange
          ? 'blue.50'
          : isAvailable
            ? 'white'
            : 'blackAlpha.50',
      color: isSelected
        ? 'white'
        : isInRange
          ? 'blue.500'
          : isAvailable
            ? 'gray.500'
            : 'blackAlpha.300'
    }}
    _disabled={{
      borderColor: isSelected
        ? 'blue.500'
        : isInRange
          ? 'blue.50'
          : isAvailable
            ? 'gray.400'
            : 'transparent',
      bgColor: isSelected
        ? 'blue.500'
        : isInRange
          ? 'blue.50'
          : isAvailable
            ? 'white'
            : 'blackAlpha.50',
      color: isSelected
        ? 'white'
        : isInRange
          ? 'blue.500'
          : isAvailable
            ? 'gray.500'
            : 'blackAlpha.300',
      cursor: 'not-allowed'
    }}
    _focus={{
      borderColor: isSelected
        ? 'blue.500'
        : isInRange
          ? 'blue.50'
          : isAvailable
            ? 'gray.400'
            : 'transparent',
      bgColor: isSelected
        ? 'blue.500'
        : isInRange
          ? 'blue.50'
          : isAvailable
            ? 'white'
            : 'blackAlpha.50',
      color: isSelected
        ? 'white'
        : isInRange
          ? 'blue.500'
          : isAvailable
            ? 'gray.500'
            : 'blackAlpha.300'
    }}
    _focusVisible={{
      borderColor: isSelected
        ? 'blue.500'
        : isInRange
          ? 'blue.50'
          : isAvailable
            ? 'gray.400'
            : 'transparent',
      bgColor: isSelected
        ? 'blue.500'
        : isInRange
          ? 'blue.50'
          : isAvailable
            ? 'white'
            : 'blackAlpha.50',
      color: isSelected
        ? 'white'
        : isInRange
          ? 'blue.500'
          : isAvailable
            ? 'gray.500'
            : 'blackAlpha.300'
    }}
    _active={{
      borderColor: isSelected
        ? 'blue.500'
        : isInRange
          ? 'blue.50'
          : isAvailable
            ? 'gray.400'
            : 'transparent',
      bgColor: isSelected
        ? 'blue.500'
        : isInRange
          ? 'blue.50'
          : isAvailable
            ? 'white'
            : 'blackAlpha.50',
      color: isSelected
        ? 'white'
        : isInRange
          ? 'blue.500'
          : isAvailable
            ? 'gray.500'
            : 'blackAlpha.300'
    }}
    {...props}
  >
    {date.getDate()}
  </Button>
)
