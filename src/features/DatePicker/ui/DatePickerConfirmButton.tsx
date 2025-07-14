import { DatePickerConfirmButtonProps } from './types.ts'
import React from 'react'
import { Button } from '@ui'
import { useTranslation } from 'react-i18next'

export const DatePickerConfirmButton = ({ onClick }: DatePickerConfirmButtonProps) => {
	const { t } = useTranslation()
	return (
		<Button
			onClick={onClick}
			variant="solid-blue"
		>
			{t`confirm`}
		</Button>
	)
}