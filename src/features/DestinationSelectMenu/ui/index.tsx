import React, { useEffect, useMemo, useState } from 'react'
import { Box, Menu, MenuButton, MenuList, VStack } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { Button, Icon, Input } from '@ui'
import { useTranslation } from 'react-i18next'

import { DestinationSearchBar } from './components/DestinationSearchBar'
import { SelectedSummaryRow } from './components/SelectedSummaryRow'
import { DestinationItem } from './components/DestinationItem'

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
          placeholder={t`country`}
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
      <MenuList maxWidth={{ base: 'full', md: '420px' }}
        width={{ base: 'calc(100vw - 32px)', md: '420px' }}
        minW={{ base: 'calc(100vw - 32px)', md: "auto" }}
        mx={{ base: 4, md: 0 }}
        p="3"
      >
        <DestinationSearchBar
          searchValue={searchValue}
          onSearchValueChange={setSearchValue}
          placeholder={t`search`}
        />

        <SelectedSummaryRow
          count={pendingSelections.length}
          onClearAll={() => setPendingSelections([])}
          selectedText={t`selected`}
          clearAllText={t`clearAll`}
        />

        <Box height="320px" overflowY="auto" borderBottom="1px solid" borderColor="gray.200">
          <VStack align="stretch" spacing="0">
            {filteredOptions.map(option => (
              <DestinationItem
                key={option}
                option={option}
                isSelected={pendingSelections.includes(option)}
                onToggle={togglePendingDestination}
              />
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
