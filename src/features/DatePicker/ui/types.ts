import { ButtonProps } from '@components/Button'

export interface DatePickerProps {
	fromDate?: Date | null;
	toDate?: Date | null;
	onAccept: (fromDate: Date, toDate?: Date | null) => void;
	onFromDateClick: (date: Date) => void
	isLoadingReturnDates?: boolean
	availableDepartureDates: Date[];
	availableReturnDates: Date[];
}


export interface DatePickerInputProps {
	fromDate?: Date;
	toDate?: Date;
	isFocused?: boolean;
}

export interface DatePickerCalendarProps {
	availableDates: Date[];
	startDate?: Date
	onDayClick: (date: Date) => void;
	selectedFromDate?: Date | null;
	selectedToDate?: Date | null;
	isLoading?: boolean;
	dateSelectState?: DateSelectState;
}

export interface DatePickerMonthProps {
	currentMonth: Date;
	availableDates: Date[];
	onDayClick: (date: Date) => void;
	selectedFromDate?: Date | null;
	selectedToDate?: Date | null;
	isLoading?: boolean
	dateSelectState?: DateSelectState;
}

export type DateButtonProps = {
	isAvailable: boolean;
	isActive?: boolean;
	isInRange?: boolean;
	isSelected: boolean;
	onClick: (date: Date) => void;
	date: Date
} & Omit<ButtonProps, 'onClick'>;

export interface DatePickerFooterProps {
	onConfirm: () => void;
	isConfirmDisabled: boolean;
	fromDate: Date | null;
	toDate: Date | null;
}

export type DatePickerHeaderProps = {
	fromDate?: Date | null;
	toDate?: Date | null;
	dateSelectState?: DateSelectState;
	onFromTabClick: () => void;
};

export type DateSelectState = 'from' | 'to'
