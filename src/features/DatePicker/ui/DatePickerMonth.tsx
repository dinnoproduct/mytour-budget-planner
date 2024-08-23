import React from 'react'
import { Box, SimpleGrid, Button } from '@chakra-ui/react'
import { DateButtonProps, DatePickerMonthProps } from './types'
import { Text } from '@ui'
import { useTranslation } from 'react-i18next'

const daysOfWeek = ['Կիր', 'Երկ', 'Երք', 'Չրք', 'Հնգ', 'Ուրբ', 'Շբթ'] // Armenian abbreviations for days of the week

const isSameDay = (date1: Date, date2: Date) => {
	return date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
}

const isBetween = (date: Date, start: Date, end: Date) => {
	return date > start && date < end
}

export const DatePickerMonth: React.FC<DatePickerMonthProps> = ({
	                                                                currentMonth,
	                                                                availableFlightDates,
	                                                                onDayClick,
	                                                                selectedFromDate,
	                                                                selectedToDate
                                                                }) => {
	const {t} = useTranslation()
	const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
	const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

	const daysInMonth = []
	for (let i = startOfMonth.getDay(); i > 0; i--) {
		daysInMonth.push(null) // Padding days from the previous month
	}

	for (let day = 1; day <= endOfMonth.getDate(); day++) {
		const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
		daysInMonth.push(date)
	}

	return (
		<Box>
			<SimpleGrid columns={7} spacing="4px" mb="4">
				{['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map(day => (
					<Text key={day} size="xs" align="center" color="gray.500">{t(day)}</Text>
				))}
			</SimpleGrid>

			<SimpleGrid columns={7} spacing="4px">
				{daysInMonth.map((date, index) => {
					if (!date) {
						return <Box key={index}/> // Empty box for padding
					}

					const isAvailable = availableFlightDates.some(flightDate => isSameDay(flightDate, date))
					const isSelected = (selectedFromDate && isSameDay(selectedFromDate, date)) || (selectedToDate && isSameDay(selectedToDate, date))
					const isInRange = selectedFromDate && selectedToDate && isBetween(date, selectedFromDate, selectedToDate)

					return (
						<DateButton
							key={index}
							date={date}
							isAvailable={isAvailable}
							isSelected={!!isSelected}
							isInRange={!!isInRange}
							onClick={onDayClick}
						/>
					)
				})}
			</SimpleGrid>
		</Box>
	)
}

const DateButton = ({ date, isAvailable, isSelected, isInRange, onClick, ...props }: DateButtonProps) => {
	return (
		<Button
			onClick={() => isAvailable && onClick(date)}
			isDisabled={!isAvailable}
			border="1px solid"
			borderColor={isSelected ? 'blue.500' : isInRange ? 'blue.50' : isAvailable ? 'gray.400' : 'transparent'}
			bgColor={isSelected ? 'blue.500' : isInRange ? 'blue.50' : isAvailable ? 'white' : 'blackAlpha.50'}
			color={isSelected ? 'white' : isInRange ? 'blue.500' : isAvailable ? 'gray.500' : 'blackAlpha.300'}
			rounded="base"
			height="48px"
			width="48px"
			fontSize="text-xs"
			lineHeight="text-xs"
			_hover={{
				borderColor: isSelected ? 'blue.500' : isInRange ? 'blue.50' : isAvailable ? 'gray.400' : 'transparent',
				bgColor: isSelected ? 'blue.500' : isInRange ? 'blue.50' : isAvailable ? 'white' : 'blackAlpha.50',
				color: isSelected ? 'white' : isInRange ? 'blue.500' : isAvailable ? 'gray.500' : 'blackAlpha.300'
			}}
			_disabled={{
				borderColor: isSelected ? 'blue.500' : isInRange ? 'blue.50' : isAvailable ? 'gray.400' : 'transparent',
				bgColor: isSelected ? 'blue.500' : isInRange ? 'blue.50' : isAvailable ? 'white' : 'blackAlpha.50',
				color: isSelected ? 'white' : isInRange ? 'blue.500' : isAvailable ? 'gray.500' : 'blackAlpha.300',
				cursor: 'not-allowed'
			}}
			_focus={{
				borderColor: isSelected ? 'blue.500' : isInRange ? 'blue.50' : isAvailable ? 'gray.400' : 'transparent',
				bgColor: isSelected ? 'blue.500' : isInRange ? 'blue.50' : isAvailable ? 'white' : 'blackAlpha.50',
				color: isSelected ? 'white' : isInRange ? 'blue.500' : isAvailable ? 'gray.500' : 'blackAlpha.300'
			}}
			_focusVisible={{
				borderColor: isSelected ? 'blue.500' : isInRange ? 'blue.50' : isAvailable ? 'gray.400' : 'transparent',
				bgColor: isSelected ? 'blue.500' : isInRange ? 'blue.50' : isAvailable ? 'white' : 'blackAlpha.50',
				color: isSelected ? 'white' : isInRange ? 'blue.500' : isAvailable ? 'gray.500' : 'blackAlpha.300'
			}}
			_active={{
				borderColor: isSelected ? 'blue.500' : isInRange ? 'blue.50' : isAvailable ? 'gray.400' : 'transparent',
				bgColor: isSelected ? 'blue.500' : isInRange ? 'blue.50' : isAvailable ? 'white' : 'blackAlpha.50',
				color: isSelected ? 'white' : isInRange ? 'blue.500' : isAvailable ? 'gray.500' : 'blackAlpha.300'
			}}
			{...props}
		>
			{date.getDate()}
		</Button>
	)
}
