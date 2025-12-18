import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  VStack,
  Text
} from '@chakra-ui/react'
import { Icon, Input, Button } from '@ui'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LANGUAGE_PREFIX, type LanguageName } from '@shared/model'
import type { PackageCity } from '@entities/package'
import {SearchMultiCitiesProps} from "@features/SearchMultiCities/ui/types.ts";
import {ChevronRightIcon} from "@chakra-ui/icons";

export const SearchMultiCities = ({
                               defaultSelectedCity,
                               cities,
                               onChange,
                               placeholder = ''
                             }: SearchMultiCitiesProps) => {
  const { i18n, t } = useTranslation()
  const [isDropdownOpen, setDropdownOpen] = useState(false)

  const [selectedCities, setSelectedCities] = useState<number[]>([])

  useEffect(() => {
    if (defaultSelectedCity) {
      setSelectedCities(
        Array.isArray(defaultSelectedCity)
          ? defaultSelectedCity
          : [defaultSelectedCity]
      )
    }
  }, [defaultSelectedCity])

  const cityNameField = useMemo(
    () =>
      `name${LANGUAGE_PREFIX[i18n.language as LanguageName]}` as keyof PackageCity,
    [i18n.language]
  )

  const groupedCities = useMemo(() => {
    return cities.reduce((acc, city) => {
      // @ts-ignore
      const countryName = city.country[cityNameField] as string
      if (!acc[countryName]) acc[countryName] = []
      acc[countryName].push(city)
      return acc
    }, {} as Record<string, PackageCity[]>)
  }, [cities, cityNameField])

  const handleCityToggle = (city: PackageCity) => {
    const countryId = city.countryId

    // Get currently selected cities from the same country as the clicked city
    const currentCountryCities = selectedCities.filter(
      id => cities.find(c => c.id === id)?.countryId === countryId
    )

    // Check if there are any selected cities from a different country
    const hasCitiesFromOtherCountry = selectedCities.some(
      id => cities.find(c => c.id === id)?.countryId !== countryId
    )

    let newSelection: number[]
    
    // If the clicked city is from a different country, deselect all and start fresh
    if (hasCitiesFromOtherCountry) {
      // Clear all selections and only select the clicked city (or cities from its country)
      if (currentCountryCities.includes(city.id)) {
        // City is already selected, just remove it
        newSelection = currentCountryCities.filter(id => id !== city.id)
      } else {
        // Select only this city (or add to existing cities from same country if any)
        newSelection = [...currentCountryCities, city.id]
      }
    } else {
      // Same country logic: toggle the city normally
      if (currentCountryCities.includes(city.id)) {
        // Deselect the city
        newSelection = currentCountryCities.filter(id => id !== city.id)
      } else {
        // Select the city
        newSelection = [...currentCountryCities, city.id]
      }
    }

    setSelectedCities(newSelection)
    onChange(newSelection)
  }

  const handleCountrySelect = (countryCities: PackageCity[]) => {
    const countryId = countryCities[0]?.countryId
    if (!countryId) return

    const countryCityIds = countryCities.map(c => c.id)
    
    const currentCountryCities = selectedCities.filter(
      id => cities.find(c => c.id === id)?.countryId === countryId
    )
    
    const allCountryCitiesSelected = countryCityIds.every(id => 
      currentCountryCities.includes(id)
    )
    
    let newSelection: number[]
    if (allCountryCitiesSelected) {
      // Deselect all cities from this country
      newSelection = selectedCities.filter(id => !countryCityIds.includes(id))
    } else {
      // Select all cities from this country, deselect all from other countries
      newSelection = countryCityIds
    }
    
    setSelectedCities(newSelection)
    onChange(newSelection)
  }

  const activeCityNames = useMemo(() => {
    return cities
      .filter(c => selectedCities.includes(c.id))
      .map(c => c[cityNameField])
      .join(', ')
  }, [selectedCities, cities, cityNameField])

  return (
    <Menu
      isOpen={isDropdownOpen}
      onClose={() => setDropdownOpen(false)}
      offset={[0, 4]}
    >
      <MenuButton
        position="relative"
        as={Box}
        width={{ base: 'full', md: '350px', lg: '320px' }}
        onClick={() => setDropdownOpen(!isDropdownOpen)}
        cursor="pointer"
        role="group"
      >

        <Icon
          name="location-pin"
          position="absolute"
          left='12px'
          top='12px'
          width='16px !important'
          color="gray.700"
          zIndex={1}
        />

        <Input
          color='gray.700'
          borderRadius='12px'
          type="text"
          value={activeCityNames}
          placeholder={t(placeholder)}
          _placeholder={{ color: 'gray.500' }}
          px='36px'
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          _groupHover={{bgColor: 'whiteAlpha.800 !important'}}
          _focus={{bgColor: 'whiteAlpha.800 !important'}}
        />

        <ChevronRightIcon
          position="absolute"
          right='12px'
          top='14px'
          height='20px'
          width='20px'
          style={{rotate: '90deg'}}
          transform={isDropdownOpen ? 'rotate(180deg)' : ''}
          color='gray.700'
        />
      </MenuButton>

      <MenuList
        minWidth="fit-content"
        width={{ base: '328px', md: '350px', lg: '320px' }}
        height="auto"
        overflowY="auto"
        zIndex={2}
      >
        <VStack width="full" spacing="1" align="stretch">
          {Object.entries(groupedCities).map(([countryName, countryCities]) => (
            <Box key={countryName}>
              <Flex
                px='4'
                py="2"
                bgColor="gray.50"
                cursor="pointer"
                _hover={{ bgColor: 'gray.100' }}
                onClick={() => handleCountrySelect(countryCities)}
              >
                <Text fontWeight="bold">{countryName}</Text>
              </Flex>

              {countryCities.map(city => (
                <Flex
                  px='4'
                  key={city.id}
                  py="2"
                  align="center"
                  justify="space-between"
                  cursor="pointer"
                  _hover={{ bgColor: 'gray.50' }}
                  onClick={() => handleCityToggle(city)}
                >
                  {/* @ts-ignore*/}
                  <Text>{city[cityNameField]}</Text>
                  {selectedCities.includes(city.id) ?
                    <Icon name="check" size="20" color="white"
                          borderRadius='2px'
                          border="1px solid"
                          borderColor="blue.500"
                          bgColor='blue.500'/>
                  : <Box width="20px"
                         height='20px'
                         borderRadius='2px'
                         border="1px solid"
                         borderColor="gray.300"/>}
                </Flex>
              ))}
            </Box>
          ))}
        </VStack>
        <Button
          mt='16px'
          size="lg"
          width='calc(100% - 32px)'
          onClick={() => setDropdownOpen(!isDropdownOpen)}
        >
          {t`apply`}
        </Button>
      </MenuList>
    </Menu>
  )
}
