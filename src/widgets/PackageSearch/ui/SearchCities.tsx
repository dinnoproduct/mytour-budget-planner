import { Box, Flex, Menu, MenuButton, MenuList, VStack } from '@chakra-ui/react'
import { Icon, Input, Text } from '@ui'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

const CITIES = [
  // { value: 'hurghada', isDisabled: true },
  { value: 'sharmElSheikh'  }
]

export const SearchCities = () => {
  const {t} = useTranslation()
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const [selectedCities, setSelectedCities] = useState<string[]>([CITIES[0].value])

  const handleCitySelect = (cityValue: string) => {
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

  return (
    <Menu
      isOpen={isDropdownOpen}
      onClose={() => setDropdownOpen(false)}
      offset={[0, 4]}
    >
      <MenuButton
        as={Box}
        width={{
          base: '328px',
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
            .filter(city => selectedCities.includes(city.value))
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
          <VStack width="full" spacing="1"align="stretch">
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
                onClick={() => handleCitySelect(city.value)}
              >
                <Text size="md">{t(city.value)}</Text>

                {selectedCities.includes(city.value) && (
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