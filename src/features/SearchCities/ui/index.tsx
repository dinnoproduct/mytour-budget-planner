import { Box, Flex, Menu, MenuButton, MenuList, VStack } from '@chakra-ui/react'
import { Icon, Input, Text } from '@ui'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type SearchCitiesProps } from './types.ts'
import { LANGUAGE_PREFIX, type LanguageName } from '@shared/model'
import type { PackageCity } from '@entities/package'

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
          value={activeCityValue}
          width="full"
          borderColor={isDropdownOpen ? 'blue.500' : undefined}
          leftIconName="location-pin"
          placeholder={t(placeholder)}
          _placeholder={{
            color: 'blackAlpha.900'
          }}
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
            {cities.map((city: PackageCity) => (
              <Flex
                key={city.id}
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
                cursor="pointer"
                onClick={() => handleCitySelect(city.id)}
              >
                <Text size="md">{city[cityNameField] as string}</Text>

                {selectedCity === city.id && (
                  <Icon name="check" size="20" color="blue.500" />
                )}
              </Flex>
            ))}
          </VStack>
        </Box>
      </MenuList>
    </Menu>
  )
}
