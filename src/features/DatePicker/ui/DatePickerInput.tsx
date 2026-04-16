import React from 'react'
import { DatePickerInputProps } from './types'
import { Input } from '@ui'
import { useTranslation } from 'react-i18next'

export const DatePickerInput = ({ fromDate, toDate, isFocused }: DatePickerInputProps) => {
	const {t} = useTranslation()

	const formatDate = (date?: Date) => {
		if (!date) {
			return ''
		}

		const longMonthName = date.toLocaleString('en-US', { month: 'long' }).toLowerCase()
		const shortMonthName = t(`${longMonthName}Short`)
		return `${shortMonthName} ${date.getDate()}`
	}

	return (
		<Input
			type="text"
			value={`${formatDate(fromDate)} - ${formatDate(toDate)}`}
			width="full"
			borderColor={isFocused ? 'blue.500' : undefined}
			leftIconName="calendar-today"
		/>
	)
}


