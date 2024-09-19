import React, { useState, useMemo, useEffect } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { DatePickerCalendarProps } from './types'
import { DatePickerMonth } from './DatePickerMonth'
import { Text, Button } from '@ui'
import { useTranslation } from 'react-i18next'
import { useBreakpoint } from '@shared/hooks'

const MAX_MONTHS = 8

export const DatePickerCalendar = ({
	                                   availableDates,
	                                   startDate,
	                                   onDayClick,
	                                   selectedFromDate,
	                                   selectedToDate,
	                                   isLoading,
	                                   dateSelectState
                                   }: DatePickerCalendarProps) => {
	const today = new Date()
	const [currentMonth, setCurrentMonth] = useState(startDate || today)

	useEffect(() => {
		if (selectedFromDate && dateSelectState === 'from') {
			setCurrentMonth(new Date(selectedFromDate.getFullYear(), selectedFromDate.getMonth(), 1))
		} else if (availableDates.length > 0) {
			const earliestAvailableDate = new Date(availableDates[0])
			setCurrentMonth(new Date(earliestAvailableDate.getFullYear(), earliestAvailableDate.getMonth(), 1))
		} else if (selectedFromDate) {
			setCurrentMonth(new Date(selectedFromDate.getFullYear(), selectedFromDate.getMonth(), 1))
		} else if (startDate) {
			setCurrentMonth(new Date(startDate.getFullYear(), startDate.getMonth(), 1))
		} else {
			setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1))
		}
	}, [JSON.stringify(availableDates), startDate, selectedFromDate])

	const { isMd } = useBreakpoint()

	const maxDate = useMemo(
		() => new Date(today.getFullYear(), today.getMonth() + (MAX_MONTHS - 2), 1),
		[today]
	)

	const handlePrevMonth = () => {
		if (currentMonth > new Date(today.getFullYear(), today.getMonth(), 1)) {
			const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
			setCurrentMonth(prevMonth)
		}
	}

	const handleNextMonth = () => {
		if (currentMonth < maxDate) {
			const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
			setCurrentMonth(nextMonth)
		}
	}

	const isPrevDisabled = useMemo(
		() => currentMonth <= new Date(today.getFullYear(), today.getMonth(), 1),
		[currentMonth, today]
	)

	const isNextDisabled = useMemo(
		() => currentMonth >= maxDate,
		[currentMonth, maxDate]
	)

	return (
		<Box
			width="full"
			overflowY={{ base: 'scroll', md: 'unset' }}
			height={{ base: 'calc(100% - 192px)', md: 'auto' }}
		>
			<Flex
				alignItems={{ base: 'center', md: 'flex-start' }}
				direction={{ base: 'column', md: 'row' }}
				px={{ md: 4 }}
				pb="4"
			>
				{!isMd ? (
					Array.from({ length: MAX_MONTHS }).map((_, index) => {
						const monthDate = new Date(
							startDate ? startDate.getFullYear() : currentMonth.getFullYear(),
							startDate ? startDate.getMonth() + index : currentMonth.getMonth() + index,
							1
						)
						return (
							<Box key={index} pt="4" px="4">
								<MonthHeader
									month={monthDate}
								/>

								<DatePickerMonth
									currentMonth={monthDate}
									availableDates={availableDates}
									isLoading={isLoading}
									onDayClick={onDayClick}
									selectedFromDate={selectedFromDate}
									selectedToDate={selectedToDate}
									dateSelectState={dateSelectState}
								/>
							</Box>
						)
					})
				) : (
					<>
						<Box pt="4" px="4">
							<MonthHeader
								month={currentMonth}
								onPrevClick={handlePrevMonth}
								onNextClick={handleNextMonth}
								isPrevDisabled={isPrevDisabled}
								isNextDisabled={isNextDisabled}
							/>

							<DatePickerMonth
								currentMonth={currentMonth}
								availableDates={availableDates}
								isLoading={isLoading}
								onDayClick={onDayClick}
								selectedFromDate={selectedFromDate}
								selectedToDate={selectedToDate}
								dateSelectState={dateSelectState}
							/>
						</Box>
					</>
				)}
			</Flex>
		</Box>
	)
}

const MonthHeader = ({
	                     month,
	                     onPrevClick,
	                     onNextClick,
	                     isPrevDisabled,
	                     isNextDisabled
                     }: {
	month: Date;
	onPrevClick?: () => void;
	onNextClick?: () => void;
	isPrevDisabled?: boolean;
	isNextDisabled?: boolean;
}) => {
	const { t } = useTranslation()

	const monthName = month.toLocaleString('en-US', { month: 'long' }).toLowerCase();
	const year = month.getFullYear()

	return (
		<Flex
			width="full"
			justify="space-between"
			mb="4"
			align="center"
		>
			<Button
				onClick={() => onPrevClick && onPrevClick()}
				icon="chevron-left"
				variant="solid-gray"
				size="sm"
				isDisabled={isPrevDisabled}
				display={{ base: 'none', md: 'inline-flex' }}
			/>

			<Text size="md" color="gray.800" align="center" flexGrow="1">
				{`${t(monthName)} ${year}`}
			</Text>

			<Button
				onClick={() => onNextClick && onNextClick()}
				icon="chevron-right"
				variant="solid-gray"
				size="sm"
				isDisabled={isNextDisabled}
				display={{ base: 'none', md: 'inline-flex' }}
			/>
		</Flex>
	)
}
