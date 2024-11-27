import { type ButtonProps, type MenuProps } from '@chakra-ui/react'
import type { ComponentType } from 'react'

export type DatePickerProps = {
  fromDate?: Date | null
  toDate?: Date | null
  onAccept: (fromDate: Date, toDate?: Date | null) => void
  CustomButton?: ComponentType<DatePickerCustomButtonProps>
  menuProps?: Omit<MenuProps, 'children'>
}

export type DatePickerInputProps = {
  fromDate?: Date
  toDate?: Date
  isFocused?: boolean
}

export type DatePickerCustomButtonProps = {
  fromDate?: Date
  toDate?: Date
  isFocused?: boolean
  onClick: () => void
}

export type DatePickerCalendarProps = {
  onDayClick: (date: Date) => void
  selectedFromDate?: Date | null
  selectedToDate?: Date | null
  isLoading?: boolean
}

export type DatePickerMonthProps = {
  currentMonth: Date
  onDayClick: (date: Date) => void
  selectedFromDate?: Date | null
  selectedToDate?: Date | null
  isLoading?: boolean
}

export type DateButtonProps = {
  isInRange: boolean
  isSelected: boolean
  isAvailable: boolean
  onClick: (date: Date) => void
  date: Date
} & Omit<ButtonProps, 'onClick'>

export type DatePickerConfirmButtonProps = {
  onClick: () => void
}

export type DatePickerHeaderProps = {
  fromDate?: Date | null
  toDate?: Date | null
}
