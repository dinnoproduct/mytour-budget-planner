import { DatePickerConfirmButtonProps } from './types'
import React from 'react'
import { Button } from '@ui'
import { useTranslation } from 'react-i18next'

export const DatePickerConfirmButton = ({ onClick }: DatePickerConfirmButtonProps) => {
	const { t } = useTranslation()
	return (
		<Button
      size='lg'
			onClick={onClick}
			variant="solid-blue"
		>
			{t`confirm`}
		</Button>
	)
}
