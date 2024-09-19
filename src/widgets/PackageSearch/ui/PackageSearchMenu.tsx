import React, { useState, useEffect, useMemo } from 'react'
import { Box, Flex, VStack } from '@chakra-ui/react'
import { PackageSearchForm } from './PackageSearchForm.tsx'
import { CITIES, usePackagesSearchContext } from '@entities/package'
import { useTranslation } from 'react-i18next'
import { Icon, Text } from '@ui'
import { capitalize } from '@shared/utils'

export const PackageSearchMenu = () => {
	const { t } = useTranslation()
	const { searchData } = usePackagesSearchContext()
	const [isFormOpen, setFormOpen] = useState(false)

	const formatDate = (date?: Date | null) => {
		if (!date) {
			return ''
		}

		const longMonthName = date.toLocaleString('en-US', { month: 'long' }).toLowerCase();
		const shortMonthName = t(`${longMonthName}Short`)
		return `${shortMonthName} ${date.getDate()}`
	}

	useEffect(() => {
		if (isFormOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}
	}, [isFormOpen])

	const cityLabel = useMemo(() => {
			const value  = CITIES.find(city => searchData.selectedCities.includes(city.id))?.value
			return value ? t(value) : ''
		},
		[searchData.selectedCities]
	)

	return (
		<Box height="full">
			{isFormOpen && (
				<Box
					position="absolute"
					top="310px"
					left="0"
					width="100vw"
					height="100vh"
					bgColor="whiteAlpha.600"
					zIndex="-1"
					onClick={() => setFormOpen(false)}
				/>
			)}

			<Box
				width="368px"
			>
				<Box display={isFormOpen ? 'block' : 'none'}>
					<Flex justify="space-between" align="center">
						<Text size="sm" color="black">{t`edit`}</Text>

						<Box
							onClick={() => setFormOpen(false)}
							cursor="pointer"
						>
							<Icon name="close" size="24" color="blue.500"/>
						</Box>
					</Flex>

					<VStack spacing="4" align="stretch" mt="4">
						<PackageSearchForm onSearch={() => setFormOpen(false)}/>
					</VStack>
				</Box>

				<Box
					display={isFormOpen ? 'none' : 'block'}
					onClick={() => setFormOpen(true)}
					cursor="pointer"
				>
					<Flex width="full" justify="space-between">
						<Text size="sm" color="black" noOfLines={1}>
							{cityLabel}
						</Text>
						<Icon name="edit-note" size="24" color="blue.500"/>
					</Flex>
					<Text size="sm" color="gray.500" mt="2" noOfLines={1}>
						{formatDate(searchData.fromDate)} - {formatDate(searchData.toDate)} • {searchData.travelersData.adultsCount + searchData.travelersData.childrenCount} {capitalize(t`traveler`)}
					</Text>
				</Box>
			</Box>
		</Box>
	)
}