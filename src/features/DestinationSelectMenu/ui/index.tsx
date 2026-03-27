import React from 'react'
import { Box, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { Icon, Input } from '@ui'
import { useTranslation } from 'react-i18next'

interface DestinationSelectMenuProps {
  isOpen: boolean
  options: string[]
  selectedValues: string[]
  onToggleOpen: () => void
  onClose: () => void
  onToggleDestination: (value: string) => void
}

export const DestinationSelectMenu: React.FC<DestinationSelectMenuProps> = ({
  isOpen,
  options,
  selectedValues,
  onToggleOpen,
  onClose,
  onToggleDestination
}) => {
  const { t } = useTranslation()

  return (
    <Menu isOpen={isOpen} onClose={onClose} offset={[0, 4]} closeOnSelect={false}>
      <MenuButton
        as={Box}
        position="relative"
        width={{ base: 'full', md: '420px' }}
        onClick={onToggleOpen}
        cursor="pointer"
        role="group"
      >
        <Icon
          name="location-pin"
          position="absolute"
          left="12px"
          top="12px"
          width="16px !important"
          color="gray.700"
          zIndex={1}
        />
        <Input
          type="text"
          value={selectedValues.join(', ')}
          placeholder={t`destination`}
          isReadOnly
          px="36px"
          borderRadius="12px"
          _groupHover={{ bgColor: 'whiteAlpha.800 !important' }}
          _focus={{ bgColor: 'whiteAlpha.800 !important' }}
        />
        <ChevronRightIcon
          position="absolute"
          right="12px"
          top="14px"
          height="20px"
          width="20px"
          style={{ rotate: '90deg' }}
          transform={isOpen ? 'rotate(180deg)' : ''}
          color="gray.700"
        />
      </MenuButton>
      <MenuList width={{ base: '328px', md: '420px' }} p="2">
        {options.map(option => (
          <MenuItem
            key={option}
            onClick={() => onToggleDestination(option)}
            borderRadius="8px"
          >
            <Flex align="center" justify="space-between" width="full">
              <Text
                color={selectedValues.includes(option) ? 'blue.600' : 'gray.700'}
                fontWeight={selectedValues.includes(option) ? '600' : '400'}
              >
                {option}
              </Text>
              {selectedValues.includes(option) && (
                <Icon name="check" size="18" color="blue.500" />
              )}
            </Flex>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}
