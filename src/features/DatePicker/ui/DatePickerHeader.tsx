import { DatePickerHeaderProps } from './types.ts'
import React from 'react'
import { Box, Flex, Hide, Show } from '@chakra-ui/react'
import { Icon, Text } from '@ui'
import { useTranslation } from 'react-i18next'

export const DatePickerHeader = ({ fromDate, toDate }: DatePickerHeaderProps) => {
	const { t } = useTranslation()

	const formatDate = (date: Date) => {
		if (!date) {
			return ''
		}

		const longMonthName = date.toLocaleString('default', { month: 'long' }).toLowerCase()

		const shortMonthName = t(`${longMonthName}Short`)

		return `${shortMonthName} ${date.getDate()},  ${date.getFullYear()}`
	}

	return (
		<Flex
			width="full"
			justifyContent="space-between"
			alignItems="center"
			height={{ base: '48px', md: '70px' }}
			borderBottom="1px solid"
			borderTop={{ base: '1px solid', md: 'none' }}
			borderColor="gray.100"
			pt={{ base: 0, md: 4 }}
		>
			<Flex width="full" justify="center">
				<Text size={{ base: 'xs', md: 'sm' }}>
					{`${t`departure`} • ${formatDate(fromDate as any)}`}
				</Text>
			</Flex>

			<Box
				height={{ base: '24px', md: '30px' }}
			>
				<Show above="md">
					<Icon
						name="compare-arrows" color="gray.400"
						size="30"
					/>
				</Show>

				<Hide above="md">
					<Icon
						name="compare-arrows" color="gray.400"
						size="24"
					/>
				</Hide>
			</Box>

			<Flex width="full" justify="center">
				<Text size={{ base: 'xs', md: 'sm' }}>
					{`${t`return`} • ${formatDate(toDate as any)}`}
				</Text>
			</Flex>
		</Flex>
	)
}