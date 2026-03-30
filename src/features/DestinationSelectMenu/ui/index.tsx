import React, { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Checkbox,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  VStack
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { Button, Icon, Input, Text } from '@ui'
import { useTranslation } from 'react-i18next'

interface DestinationSelectMenuProps {
  isOpen: boolean
  options: string[]
  selectedValues: string[]
  onToggleOpen: () => void
  onClose: () => void
  onApply: (values: string[]) => void
}

export const DestinationSelectMenu: React.FC<DestinationSelectMenuProps> = ({
  isOpen,
  options,
  selectedValues,
  onToggleOpen,
  onClose,
  onApply
}) => {
  const { t } = useTranslation()
  const [searchValue, setSearchValue] = useState('')
  const [pendingSelections, setPendingSelections] = useState<string[]>(selectedValues)

  useEffect(() => {
    if (isOpen) {
      setPendingSelections(selectedValues)
      setSearchValue('')
    }
  }, [isOpen, selectedValues])

  const filteredOptions = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase()
    if (!normalizedSearch) return options
    return options.filter(option => option.toLowerCase().includes(normalizedSearch))
  }, [options, searchValue])

  const togglePendingDestination = (value: string) => {
    if (pendingSelections.includes(value)) {
      setPendingSelections(prev => prev.filter(item => item !== value))
      return
    }
    setPendingSelections(prev => [...prev, value])
  }

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
        <Input
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          placeholder={t`search`}
          mb="2"
          borderRadius="10px"
        />

        <Box height="340px" overflowY="auto" pr="1">
          <VStack align="stretch" spacing="1">
            {filteredOptions.map(option => (
              <MenuItem
                key={option}
                onClick={() => togglePendingDestination(option)}
                borderRadius="8px"
              >
                <Flex align="center" width="full" gap="2">
                  <Checkbox
                    isChecked={pendingSelections.includes(option)}
                    pointerEvents="none"
                    colorScheme="blue"
                  />
                  <Text
                    color={pendingSelections.includes(option) ? 'blue.600' : 'gray.700'}
                    fontWeight={pendingSelections.includes(option) ? '600' : '400'}
                  >
                    {option}
                  </Text>
                </Flex>
              </MenuItem>
            ))}
          </VStack>
        </Box>

        <Button
          mt="3"
          size="lg"
          width="full"
          onClick={() => onApply(pendingSelections)}
        >
          {t`confirm`}
        </Button>
      </MenuList>
    </Menu>
  )
}
