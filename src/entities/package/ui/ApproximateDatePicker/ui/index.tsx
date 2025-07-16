import { MONTHS } from '@/shared/model'
import { VStack, Divider, Box } from '@chakra-ui/react'
import { Input, Text } from '@ui'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { MonthsSelect } from './MonthsSelect'
import { DaysSelect } from './DaysSelect'
import { Footer } from './Footer'
import { type ApproximateDatePickerPropsType, type StayInfoType } from './types'
import { useTranslation } from 'react-i18next'
import {
  HOTEL_DAYS_OPTIONS,
  MONTHS_COUNT_TO_DISPLAY,
  PACKAGE_DAYS_OPTIONS
} from '../model/constants'
import {
  getDefaultDayValue,
  getMonthRange,
  getMonthsToDisplay
} from '../helper'

const monthsToDisplay = getMonthsToDisplay(MONTHS_COUNT_TO_DISPLAY)

export const ApproximateDatePicker = ({
  variant = 'package',
  monthValue,
  defaultMonthValue = MONTHS[moment().month()],
  daysValue,
  isResetState,
  onConfirm
}: Readonly<ApproximateDatePickerPropsType>) => {
  const DAYS_OPTIONS =
    variant === 'package' ? PACKAGE_DAYS_OPTIONS : HOTEL_DAYS_OPTIONS
  const {
    day: defaultDay,
    isOther,
    actualValue
  } = getDefaultDayValue(variant, daysValue)

  const defaultMonth = monthValue ?? defaultMonthValue

  const scrollIntoViewId = `${variant}-default-month`

  const [stayInfo, setStayInfo] = useState<StayInfoType>({
    month: defaultMonth,
    day: defaultDay
  })
  const [showInput, setShowInput] = useState<boolean>(isOther)
  const [inputValue, setInputValue] = useState<string>(
    isOther ? actualValue ?? '' : ''
  )

  const { t } = useTranslation()

  useEffect(() => {
    const element = document.getElementById(scrollIntoViewId)

    if (element === null) {
      return
    }

    element.scrollIntoView({
      block: 'nearest',
      inline: 'start'
    })
  }, [isResetState, scrollIntoViewId])

  useEffect(() => {
    setStayInfo({
      month: defaultMonth,
      day: defaultDay
    })
    setShowInput(isOther)
    setInputValue(isOther ? actualValue ?? '' : '')
  }, [isResetState, defaultMonth, defaultDay, isOther, actualValue])

  const handleOnConfirm = () => {
    const days =
      variant === 'hotel' && inputValue.length > 0 && stayInfo.day === 'other'
        ? inputValue
        : stayInfo.day

    const { startOfMonth, endOfMonth } = getMonthRange(stayInfo.month)

    onConfirm({
      days: Number(days),
      dateFrom: startOfMonth,
      dateTo: endOfMonth
    })
  }

  const onChangeDaysHandler = (value: string) => {
    setStayInfo(prev => ({ ...prev, day: value }))
    setShowInput(value === 'other')
  }

  const onChangeMonthsHandler = (value: string) =>
    setStayInfo(prev => ({ ...prev, month: value }))

  return (
    <Box maxW="full">
      <VStack spacing={7} pt="8" px={3}>
        <Text fontWeight="500" size="md" color="gray.800">
          {t`howManyDaysAreYouPlanning`}
        </Text>

        <DaysSelect
          days={DAYS_OPTIONS}
          activeValue={stayInfo.day}
          onChange={onChangeDaysHandler}
        />

        {showInput && (
          <Input
            value={inputValue}
            placeholder={t`numberOfDays`}
            onChange={e => setInputValue(e.target.value)}
            width="full"
          />
        )}
      </VStack>

      <Divider my="7" />

      <MonthsSelect
        id={scrollIntoViewId}
        monthsToDisplay={monthsToDisplay}
        activeValue={stayInfo.month}
        onChange={onChangeMonthsHandler}
      />

      <Footer
        day={stayInfo.day === 'other' ? inputValue : stayInfo.day}
        month={stayInfo.month}
        onConfirm={handleOnConfirm}
      />
    </Box>
  )
}
