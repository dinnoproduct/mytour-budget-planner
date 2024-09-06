import React, { useMemo } from 'react'
import { DatePickerInputProps } from './types.ts'
import { Input } from '@ui'
import { useTranslation } from 'react-i18next'

export const DatePickerInput = ({ fromDate, toDate, isFocused }: DatePickerInputProps) => {
	const {t, i18n} = useTranslation()

	const formatDate = (date?: Date) => {
		if (!date) {
			return ''
		}

		const longMonthName = date.toLocaleString('default', { month: 'long' }).toLowerCase()
		const shortMonthName = t(`${longMonthName}Short`)
		return `${shortMonthName} ${date.getDate()}`
	}

	const inputValue = useMemo(() => {
		if (!fromDate || !toDate) {
			return ''
		}

		return `${formatDate(fromDate)} - ${formatDate(toDate)}`
	}, [fromDate, toDate, i18n.language])

	return (
		<Input
			type="text"
			value={inputValue}
			width="full"
			borderColor={isFocused ? 'blue.500' : undefined}
			leftIconName="calendar-today"
			placeholder={t`duration`}
		/>
	)
}


