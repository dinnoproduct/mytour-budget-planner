import { Box, Flex, Menu, MenuButton, MenuList, VStack } from '@chakra-ui/react'
import { Icon, Input, Text } from '@ui'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type SearchCitiesProps } from './types.ts'
import { type PackageCityOption } from '@entities/package/model/types.ts'

export const SearchCities = ({
  defaultSelectedCity,
  cities,
  onChange
}: SearchCitiesProps) => {
  const { t } = useTranslation()
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState<number>(cities[0].id)

  useEffect(() => {
    if (defaultSelectedCity && defaultSelectedCity !== selectedCity) {
      setSelectedCity(defaultSelectedCity)
    }
  }, [defaultSelectedCity])

  const handleCitySelect = (cityId: number) => {
    console.log('handleCitySelect', cityId)
    setSelectedCity(cityId)
    onChange && onChange(cityId)
    setDropdownOpen(false)
  }

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
          value={t(cities.find(city => city.id === selectedCity)?.value || '')}
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
            {cities.map((city: PackageCityOption) => (
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
                cursor="pointer"
                onClick={() => handleCitySelect(city.id)}
              >
                <Text size="md">{t(city.value)}</Text>

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
