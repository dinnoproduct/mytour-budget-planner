import React, { useState, useEffect } from 'react'
import { Box, Flex, Menu, MenuButton, MenuList, Portal, useBreakpointValue, useMediaQuery } from '@chakra-ui/react'
import { DatePickerProps } from './types.ts'
import { DatePickerInput } from './DatePickerInput.tsx'
import { DatePickerCalendar } from './DatePickerCalendar.tsx'
import { DatePickerConfirmButton } from './DatePickerConfirmButton.tsx'
import { DatePickerHeader } from './DatePickerHeader.tsx'
import { Button, Text } from '@ui'
import { useTranslation } from 'react-i18next'

export const DatePicker = ({
	                          fromDate,
	                          toDate,
	                          onAccept,
	                          availableFlightDates
                          }: DatePickerProps) => {
	const { t } = useTranslation()
	const [selectedFromDate, setSelectedFromDate] = useState<Date | null>(fromDate || null)
	const [selectedToDate, setSelectedToDate] = useState<Date | null>(toDate || null)
	const [isCalendarOpen, setCalendarOpen] = useState(false)
	const [inputFromDate, setInputFromDate] = useState<Date | null>(fromDate || null)
	const [inputToDate, setInputToDate] = useState<Date | null>(toDate || null)

	const isMobile = useMediaQuery('(max-width: 1280px)')[0]

	// Sync the selected dates with the input dates when the calendar is opened
	useEffect(() => {
		if (isCalendarOpen) {
			setSelectedFromDate(inputFromDate)
			setSelectedToDate(inputToDate)
			// Disable body scroll on mobile when calendar is open
			if (isMobile) {
				document.body.style.overflow = 'hidden'
			}
		} else {
			// Re-enable body scroll when calendar is closed
			document.body.style.overflow = ''
		}
	}, [isCalendarOpen, inputFromDate, inputToDate, isMobile])

	const handleDayClick = (date: Date) => {
		if (!selectedFromDate || (selectedFromDate && selectedToDate)) {
			setSelectedFromDate(date)
			setSelectedToDate(null)
		} else if (selectedFromDate && !selectedToDate && date >= selectedFromDate) {
			setSelectedToDate(date)
		}
	}

	const handleAccept = () => {
		if (selectedFromDate && selectedToDate) {
			onAccept(selectedFromDate, selectedToDate)
			setInputFromDate(selectedFromDate)
			setInputToDate(selectedToDate)
			setCalendarOpen(false)
		}
	}

	return (
		<Menu
			isOpen={isCalendarOpen}
			onClose={() => setCalendarOpen(false)}
			offset={[0, 4]}
		>
			<MenuButton
				as={Box}
				width={{
					base: '328px',
					md: '350px',
					lg: '320px'
				}}
				onClick={() => setCalendarOpen(!isCalendarOpen)}
				cursor="pointer"
			>
				<DatePickerInput
					fromDate={inputFromDate as any}
					toDate={inputToDate as any}
					isFocused={isCalendarOpen}
				/>
			</MenuButton>

			<Portal>
				<MenuList
					p={0}
					borderRadius={{ base: '0', md: 'xl' }}
					border="none"
					minWidth="fit-content"
					height="full"

					// Full-page on mobile with 80px offset from the top
					rootProps={isMobile ? {
						position: { base: 'fixed !important' as any, md: undefined },
						top: { base: '80px !important', md: undefined },
						left: { base: '0 !important', md: undefined },
						right: { base: '0 !important', md: undefined },
						bottom: { base: '0 !important', md: undefined },
						height: { base: 'calc(100dvh - 80px) !important', md: undefined },
						zIndex: { base: '100000 !important', md: undefined },
						overflowY: { base: 'auto !important' as any, md: undefined },
						width: { base: '100dvw !important', md: undefined },
						transform: { base: 'translate3d(0px, 0px, 0px) !important', md: undefined }
					} : {}}
				>
					<Flex
						display={{ base: 'flex', md: 'none' }}
						justify="space-between"
						px="4"
						height="64px"
						align="center"
						width="full"
					>
						<Text size="md" fontWeight="semibold">{t`duration`}</Text>

						<Button
							icon="close"
							aria-label="Close calendar"
							variant="solid-gray"
							size="sm"
							onClick={() => setCalendarOpen(false)}
						/>
					</Flex>

					<DatePickerHeader fromDate={selectedFromDate} toDate={selectedToDate}/>

					<DatePickerCalendar
						availableFlightDates={availableFlightDates}
						onDayClick={handleDayClick}
						selectedFromDate={selectedFromDate}
						selectedToDate={selectedToDate}
					/>

					<Flex
						textAlign="right"
						height="80px"
						width="full"
						align="center"
						px="8"
						justify="flex-end"
						borderTop="1px solid"
						borderColor="gray.100"
						position={{ base: 'fixed', md: 'static' }}
						bottom={{ base: 0, md: undefined }}
					>
						<DatePickerConfirmButton onClick={handleAccept}/>
					</Flex>
				</MenuList>
			</Portal>
		</Menu>
	)
}