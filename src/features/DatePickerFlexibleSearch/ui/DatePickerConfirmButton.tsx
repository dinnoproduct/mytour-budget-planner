import { type DatePickerConfirmButtonProps } from './types'
import React from 'react'
import { Button } from '@ui'
import { useTranslation } from 'react-i18next'

export const DatePickerConfirmButton = ({
  onClick,
  isDisabled
}: DatePickerConfirmButtonProps) => {
  const { t } = useTranslation()

  return (
    <Button
      size='lg'
      width="full"
      onClick={onClick}
      variant="solid-blue"
      isDisabled={isDisabled}
    >
      {t`confirm`}
    </Button>
  )
}
