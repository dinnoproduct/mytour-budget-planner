import { ButtonProps } from '@chakra-ui/react'

export type DatePickerProps = {
	fromDate?: Date | null;
	toDate?: Date | null;
	onAccept: (fromDate: Date, toDate: Date) => void;
	availableFlightDates: Date[];
};

export type DatePickerInputProps = {
	fromDate?: Date;
	toDate?: Date;
	isFocused?: boolean;
};

export type DatePickerCalendarProps = {
	availableFlightDates: Date[];
	onDayClick: (date: Date) => void;
	selectedFromDate?: Date | null;
	selectedToDate?: Date | null;
};

export type DatePickerMonthProps = {
	currentMonth: Date;
	availableFlightDates: Date[];
	onDayClick: (date: Date) => void;
	selectedFromDate?: Date | null;
	selectedToDate?: Date | null;
};

export type DateButtonProps = {
	isAvailable: boolean;
	isInRange: boolean;
	isSelected: boolean;
	onClick: (date: Date) => void;
	date: Date
} & Omit<ButtonProps, 'onClick'>;

export type DatePickerConfirmButtonProps = {
	onClick: () => void;
};

export type DatePickerHeaderProps = {
	fromDate?: Date | null;
	toDate?: Date | null;
};

