import React, { useState, useMemo } from 'react'
import { Box, Flex, useMediaQuery } from '@chakra-ui/react'
import { DatePickerCalendarProps } from './types'
import { DatePickerMonth } from './DatePickerMonth'
import { Text, Button } from '@ui'
import { useTranslation } from 'react-i18next'

const MAX_MONTHS = 6

export const DatePickerCalendar: React.FC<DatePickerCalendarProps> = ({
	                                                                      availableFlightDates,
	                                                                      onDayClick,
	                                                                      selectedFromDate,
	                                                                      selectedToDate
                                                                      }) => {
	const today = new Date()
	const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

	const isMobile = useMediaQuery('(max-width: 1280px)')[0]

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
				{isMobile ? (
					// Render MAX_MONTHS count of months stacked vertically on mobile
					Array.from({ length: MAX_MONTHS }).map((_, index) => {
						const monthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + index, 1)

						return (
							<Box key={index} pt="4" px="4">
								<MonthHeader
									month={monthDate}
									onClick={index === 0 ? handlePrevMonth : handleNextMonth}
									isDisabled={index === 0 ? isPrevDisabled : isNextDisabled}
									isNext={index !== 0}
								/>

								<DatePickerMonth
									currentMonth={monthDate}
									availableFlightDates={availableFlightDates}
									onDayClick={onDayClick}
									selectedFromDate={selectedFromDate}
									selectedToDate={selectedToDate}
								/>
							</Box>
						)
					})
				) : (
					<>
						<Box pt="4" px="4">
							<MonthHeader
								month={currentMonth}
								onClick={handlePrevMonth}
								isDisabled={isPrevDisabled}
							/>

							<DatePickerMonth
								currentMonth={currentMonth}
								availableFlightDates={availableFlightDates}
								onDayClick={onDayClick}
								selectedFromDate={selectedFromDate}
								selectedToDate={selectedToDate}
							/>
						</Box>

						<Box pt="4" px="4">
							<MonthHeader
								month={new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)}
								onClick={handleNextMonth}
								isNext
								isDisabled={isNextDisabled}
							/>

							<DatePickerMonth
								currentMonth={new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)}
								availableFlightDates={availableFlightDates}
								onDayClick={onDayClick}
								selectedFromDate={selectedFromDate}
								selectedToDate={selectedToDate}
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
	                     onClick,
	                     isNext,
	                     isDisabled
                     }: {
	month: Date
	onClick: () => void
	isNext?: boolean
	isDisabled: boolean
}) => {
	const { t } = useTranslation()

	const monthName = month.toLocaleString('default', { month: 'long' }).toLowerCase()

	return (
		<Flex
			width="full"
			justify="space-between"
			mb="4"
			align="center"
			pl={{ md: isNext ? '8' : '0' }}
			pr={{ md: isNext ? '0' : '8' }}
		>
			{!isNext ? (
				<Button
					onClick={() => onClick()}
					icon="chevron-left"
					variant="solid-gray"
					size="sm"
					isDisabled={isDisabled}
					display={{ base: 'none', md: 'inline-flex' }}
				/>
			) : null}

			<Text size="md" color="gray.800" align="center" flexGrow="1">
				{t(monthName)}
			</Text>

			{isNext && (
				<Button
					onClick={() => onClick()}
					icon="chevron-right"
					variant="solid-gray"
					size="sm"
					isDisabled={isDisabled}
					display={{ base: 'none', md: 'inline-flex' }}
				/>
			)}
		</Flex>
	)
}
