import { Box, Flex, Stack } from '@chakra-ui/react'
import React, { ReactNode, useState } from 'react'
import { DatePicker } from '../../../features/DatePicker'
import { SearchTravelers } from './SearchTravelers.tsx'
import { SearchCities } from './SearchCities.tsx'
import { Button } from '@ui'
import { useTranslation } from 'react-i18next'

const startDate = new Date(2024, 7, 16) // 16th August 2024
const endDate = new Date(2024, 12, 29) // 29th September 2024

let availableFlightDates: any[] = []
const currentDate = new Date(startDate)

while (currentDate <= endDate) {
	const dayOfWeek = currentDate.getDay()
	if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) { // Monday, Wednesday, Friday
		availableFlightDates.push(new Date(currentDate))
	}
	currentDate.setDate(currentDate.getDate() + 1)
}
const defaultFromDate = availableFlightDates[0]
const defaultToDate = availableFlightDates[1]

export const PackageSearch = () => {
	const { t } = useTranslation()
	const [fromDate, setFromDate] = useState<Date | null>(defaultFromDate)
	const [toDate, setToDate] = useState<Date | null>(defaultToDate)

	const handleAccept = (fromDate: Date | null, toDate: Date | null) => {
		setFromDate(fromDate)
		setToDate(toDate)
		console.log('Selected Dates:', { fromDate, toDate })
	}

	return (
		<Layout>
			<SearchCities/>

			<DatePicker
				fromDate={fromDate}
				toDate={toDate}
				onAccept={handleAccept}
				availableFlightDates={availableFlightDates}
			/>

			<SearchTravelers/>

			<Button size="lg" width={{ base: 'full', md: 'auto' }}>{t`search`}</Button>
		</Layout>
	)
}

const Layout = ({ children }: {children: ReactNode | ReactNode[]}) => {
	return (
		<Box
			height={{ base: '352px', md: '240px' }}
			bgImage="/assets/images/search-hero-image.jpg"
			bgSize="cover"
			bgPosition="center"
			bgRepeat="no-repeat"
			px={{ base: 4, md: 6 }}
		>
			<Flex
				align="center"
				maxWidth={{
					base: '400px',
					md: '1446px'
				}}
				mx="auto"
				width={{ base: 'max-content', md: 'max-content' }}
				height="full"
			>
				<Stack
					direction={{ base: 'column', md: 'row' }}
					spacing={{ base: 4, md: 2 }}
					zIndex="1"
					width="full"
					py={{ base: 4, md: '10' }}
					px={{ base: 4, md: '6' }}
					rounded="xl"
					align="center"
					justify="center"
					sx={{
						// backgroundColor: 'blue',
						// opacity: 0.3,
						// background: 'linear-gradient(0deg, #383838 0%, #383838 100%), rgba(179, 179, 179, 0.68)',
						backgroundBlendMode: 'color-dodge, normal',
						// backdropFilter: 'blur(25px)',
						backdropFilter: 'blur(10px)',
						background: 'rgba(241,241,241,0.55)'
					}}
				>
					{children}
				</Stack>
			</Flex>
		</Box>
	)
}
