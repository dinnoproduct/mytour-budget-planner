import { MONTHS } from '@/shared/model'
import { VStack, Divider, Box } from '@chakra-ui/react'
import { Input, Text } from '@ui'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { MonthsSelect } from './MonthsSelect'
import { NightsSelect } from './NightsSelect'
import { Footer } from './Footer'
import { type ApproximateDatePickerPropsType, type StayInfoType } from './types'
import { useTranslation } from 'react-i18next'
import {
  HOTEL_NIGHTS_OPTIONS,
  MONTHS_COUNT_TO_DISPLAY,
  PACKAGE_NIGHTS_OPTIONS
} from '../model/constants'
import {
  getDefaultNightValue,
  getMonthRange,
  getMonthsToDisplay
} from '../helper'

const monthsToDisplay = getMonthsToDisplay(MONTHS_COUNT_TO_DISPLAY)

export function ApproximateDatePicker({
  variant = 'package',
  monthValue,
  defaultMonthValue = MONTHS[moment().month()],
  nightsValue,
  isResetState,
  onConfirm
}: Readonly<ApproximateDatePickerPropsType>) {
  const NIGHTS_OPTIONS =
    variant === 'package' ? PACKAGE_NIGHTS_OPTIONS : HOTEL_NIGHTS_OPTIONS
  const {
    night: defaultNight,
    isOther,
    actualValue
  } = getDefaultNightValue(variant, nightsValue)

  const defaultMonth = monthValue ?? defaultMonthValue

  const scrollIntoViewId = `${variant}-default-month`

  const [stayInfo, setStayInfo] = useState<StayInfoType>({
    month: defaultMonth,
    night: defaultNight
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
      night: defaultNight
    })
    setShowInput(isOther)
    setInputValue(isOther ? actualValue ?? '' : '')
  }, [isResetState, defaultMonth, defaultNight, isOther, actualValue])

  const handleOnConfirm = () => {
    const nights =
      variant === 'hotel' && inputValue.length > 0 && stayInfo.night === 'other'
        ? inputValue
        : stayInfo.night

    const { startOfMonth, endOfMonth } = getMonthRange(stayInfo.month)

    onConfirm({
      nights: Number(nights),
      dateFrom: startOfMonth,
      dateTo: endOfMonth
    })
  }

  const onChangeNightsHandler = (value: string) => {
    setStayInfo(prev => ({ ...prev, night: value }))
    setShowInput(value === 'other')
  }

  const onChangeMonthsHandler = (value: string) =>
    setStayInfo(prev => ({ ...prev, month: value }))

  return (
    <Box>
      <VStack spacing={7}>
        <Text fontWeight="500">{t`howManyDaysAreYouPlanning`}</Text>
        <Box px={3}>
          <NightsSelect
            nights={NIGHTS_OPTIONS}
            activeValue={stayInfo.night}
            onChange={onChangeNightsHandler}
          />
        </Box>
        {showInput && (
          <Box px={3} width="full">
            {' '}
            <Input
              value={inputValue}
              placeholder={t`numberOfDays`}
              onChange={e => setInputValue(e.target.value)}
            />
          </Box>
        )}
        <Divider />

        <VStack spacing={7}>
          <MonthsSelect
            id={scrollIntoViewId}
            monthsToDisplay={monthsToDisplay}
            activeValue={stayInfo.month}
            onChange={onChangeMonthsHandler}
          />
        </VStack>
      </VStack>
      <Footer
        night={stayInfo.night === 'other' ? inputValue : stayInfo.night}
        month={stayInfo.month}
        onConfirm={handleOnConfirm}
      />
    </Box>
  )
}
