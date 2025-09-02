import { Box, Flex, Menu, MenuButton, MenuList, VStack } from '@chakra-ui/react'
import { Icon, Input, Text } from '@ui'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type SearchCitiesProps } from './types.ts'
import { LANGUAGE_PREFIX, type LanguageName } from '@shared/model'
import type { PackageCity } from '@entities/package'
import {ChevronRightIcon} from "@chakra-ui/icons";

export const SearchCities = ({
  defaultSelectedCity,
  cities,
  onChange,
  placeholder = ''
}: SearchCitiesProps) => {
  const { i18n, t } = useTranslation()
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState<number>(cities[0]?.id)

  useEffect(() => {
    if (defaultSelectedCity && defaultSelectedCity !== selectedCity) {
      setSelectedCity(defaultSelectedCity)
    }
  }, [defaultSelectedCity])

  const handleCitySelect = (cityId: number) => {
    setSelectedCity(cityId)
    onChange && onChange(cityId)
    setDropdownOpen(false)
  }

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

  const activeCityValue = useMemo(() => {
    const city = cities.find(city => city.id === selectedCity)

    if (!city) {
      return ''
    }

    return city[cityNameField] as string
  }, [selectedCity, cities, cityNameField])

  return (
    <Menu
      isOpen={isDropdownOpen}
      onClose={() => setDropdownOpen(false)}
      offset={[0, 4]}
    >
      <MenuButton
        position="relative"
        as={Box}
        width={{
          base: 'full',
          md: '350px',
          lg: '320px'
        }}
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
          zIndex={1}/>
        <Input
          color='gray.700'
          type="text"
          value={activeCityValue}
          width="full"
          borderColor={isDropdownOpen ? 'blue.500' : undefined}
          placeholder={t(placeholder)}
          borderRadius='12px'
          px='36px'
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          _placeholder={{
            color: 'blackAlpha.900'
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
        zIndex={2}
      >
        <Box>

          <VStack width="full" spacing="1" align="stretch">
            {Object.entries(groupedCities).map(([countryName, countryCities]) => (
              <Box key={countryName}>
                <Flex
                  px="4"
                  py="2"
                  bgColor="gray.50"
                  cursor="pointer"
                  _hover={{ bgColor: 'gray.100' }}
                >
                  <Text fontWeight="bold">{countryName}</Text>
                </Flex>

                {countryCities.map(city => (
                  <Flex
                    key={city.id}
                    px="4"
                    py="1"
                    align="center"
                    justify="space-between"
                    cursor="pointer"
                    _hover={{ bgColor: 'gray.50' }}
                    onClick={() => handleCitySelect(city.id)}
                  >
                    {/* @ts-ignore*/}
                    <Text>{city[cityNameField]}</Text>
                    {selectedCity === city.id ?
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
        </Box>
      </MenuList>
    </Menu>
  )
}
