import { DatePickerHeaderProps } from './types.ts'
import React from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { Text } from '@ui'
import { useTranslation } from 'react-i18next'

export const DatePickerHeader = ({ fromDate, toDate, dateSelectState, onFromTabClick }: DatePickerHeaderProps) => {
	const { t } = useTranslation()

	return (
		<Flex
			width="full"
			justifyContent="space-between"
			alignItems="center"
			borderTop={{ base: '1px solid', md: 'none' }}
			borderColor="gray.100"
			pt={{ base: 0, md: 4 }}
		>
			<DateTab
				label={t`departure`}
				date={fromDate}
				isActive={dateSelectState === 'from'}
				onClick={() => onFromTabClick()}
			/>

			<DateTab
				label={t`return`}
				date={toDate}
				isActive={dateSelectState === 'to'}
			/>
		</Flex>
	)
}

const DateTab = ({ date, label, isActive, onClick }: {date?: Date | null, label: string, isActive?: boolean, onClick?: () => void}) => {
	const { t } = useTranslation()

	const formatDate = (date?: Date | null) => {
		if (!date) {
			return ''
		}

		const longMonthName = date.toLocaleString('default', { month: 'long' }).toLowerCase()

		const shortMonthName = t(`${longMonthName}Short`)

		return `${shortMonthName} ${date.getDate()},  ${date.getFullYear()}`
	}

	return (
		<Box
			width="full"
			textAlign="center"
			borderBottom={isActive ? '2px solid' : '1px solid'}
			borderColor={isActive ? 'blue.500' : 'gray.100'}
			px="10px"
			pt="2"
			pb="3"
			cursor={onClick ? 'pointer' : 'default'}
			onClick={onClick}
		>
			<Text
				size="sm"
				color={isActive ? 'blue.500' : 'gray.500'}
				fontWeight="semibold"
			>
				{label}
			</Text>

			<Text
				size="xs"
				color={isActive ? 'gray.400' : 'gray.300'}
			>
				{
					date ? formatDate(date) : t`selectDay`
				}
			</Text>
		</Box>
	)
}