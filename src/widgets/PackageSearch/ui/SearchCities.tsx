import { Box, Flex, Menu, MenuButton, MenuList, VStack } from '@chakra-ui/react'
import { Icon, Input, Text } from '@ui'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SearchCitiesProps } from './types.ts'
import { CITIES } from '@entities/package'

export const SearchCities = ({ defaultSelectedCities = [], onChange }: SearchCitiesProps) => {
	const { t } = useTranslation()
	const [isDropdownOpen, setDropdownOpen] = useState(false)
	const [selectedCities, setSelectedCities] = useState<number[]>([CITIES[0].id])

	useEffect(() => {
		if (defaultSelectedCities.length && JSON.stringify(defaultSelectedCities) !== JSON.stringify(selectedCities)) {
			setSelectedCities(defaultSelectedCities)
		}
	}, [defaultSelectedCities])

	const handleCitySelect = (cityValue: number) => {
		setSelectedCities((prevSelectedCities) => {
			if (prevSelectedCities.includes(cityValue)) {
				if (prevSelectedCities.length > 1) {
					return prevSelectedCities.filter((c) => c !== cityValue)
				} else {
					return prevSelectedCities
				}
			} else {
				return [...prevSelectedCities, cityValue]
			}
		})
	}

	useEffect(() => {
		onChange && onChange(selectedCities)
	}, [selectedCities])

	return (
		<Menu
			isOpen={isDropdownOpen}
			onClose={() => setDropdownOpen(false)}
			offset={[0, 4]}
		>
			<MenuButton
				as={Box}
				width={{
					base: 'full',
					md: '350px',
					lg: '320px'
				}}
				onClick={() => setDropdownOpen(!isDropdownOpen)}
				cursor="pointer"
			>
				<Input
					type="text"
					value={
						CITIES
							.filter(city => selectedCities.includes(city.id))
							.map(city => t(city.value)).join(', ')
					}
					width="full"
					borderColor={isDropdownOpen ? 'blue.500' : undefined}
					leftIconName="location-pin"
				/>
			</MenuButton>

			<MenuList
				px="0"
				py="4"
				minWidth="fit-content"
				width={{
					base: '328px',
					md: '350px',
					lg: '320px'
				}}
				height="auto"
				overflowY="auto"
			>
				<Box>
					<VStack width="full" spacing="1" align="stretch">
						{CITIES.map((city) => (
							<Flex
								key={city.value}
								width="full"
								align="center"
								bgColor="white"
								justify="space-between"
								height="40px"
								px="4"
								_hover={{
									bgColor: 'gray.50'
								}}
								_active={{
									bgColor: 'gray.100'
								}}
								_focus={{
									bgColor: 'gray.100'
								}}
								_focusVisible={{
									bgColor: 'gray.100'
								}}
								fontSize="text-md"
								lineHeight="text-md"
								cursor={'pointer'}
								onClick={() => handleCitySelect(city.id)}
							>
								<Text size="md">{t(city.value)}</Text>

								{selectedCities.includes(city.id) && (
									<Icon name="check" size="20" color="blue.500"/>
								)}
							</Flex>
						))}
					</VStack>
				</Box>
			</MenuList>
		</Menu>
	)
}