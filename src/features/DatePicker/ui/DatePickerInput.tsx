import React from 'react'
import { type DatePickerInputProps } from './types.ts'
import { Input } from '@ui'
import { useTranslation } from 'react-i18next'
import { getPluralForm } from '@/shared/helpers'

export const DatePickerInput = ({
  fromDate,
  toDate,
  isFocused,
  days
}: DatePickerInputProps) => {
  const { t } = useTranslation()

  const formatDate = (date?: Date | null) => {
    if (!date) {
      return ''
    }

    const longMonthName = date
      .toLocaleString('default', { month: 'long' })
      .toLowerCase()
    const shortMonthName = t(`${longMonthName}Short`)

    return `${shortMonthName} ${date.getDate()}`
  }

  const getApproximateText = () => {
    if (!days || !fromDate) return ''

    const longMonthName = fromDate
      .toLocaleString('default', { month: 'long' })
      .toLowerCase()

    const month = t(longMonthName)

    return `${month.charAt(0).toUpperCase() + month.slice(1)}, ± ${t(
      getPluralForm(days, 'daysQuantity'),
      {
        day: days
      }
    )}`
  }

  return (
    <Input
      type="text"
      value={
        days && fromDate
          ? getApproximateText()
          : `${formatDate(fromDate)} - ${formatDate(toDate)}`
      }
      width="full"
      borderColor={isFocused ? 'blue.500' : undefined}
      leftIconName="calendar-today"
    />
  )
}
