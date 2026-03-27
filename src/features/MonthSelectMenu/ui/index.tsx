import React, { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid
} from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { Button, Icon, Input, Text } from '@ui'
import { useTranslation } from 'react-i18next'

interface MonthOption {
  value: string
  label: string
}

export interface MonthSelection {
  month: string
  year: number
}

interface MonthSelectMenuProps {
  isOpen: boolean
  options: MonthOption[]
  selectedValues: MonthSelection[]
  onToggleOpen: () => void
  onClose: () => void
  onApply: (values: MonthSelection[]) => void
}

export const MonthSelectMenu: React.FC<MonthSelectMenuProps> = ({
  isOpen,
  options,
  selectedValues,
  onToggleOpen,
  onClose,
  onApply
}) => {
  const { t } = useTranslation()
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [pendingSelections, setPendingSelections] = useState<MonthSelection[]>(selectedValues)
  const currentDate = useMemo(() => new Date(), [])
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const maxYear = currentYear + 1

  useEffect(() => {
    if (isOpen) {
      setPendingSelections(selectedValues)
      setSelectedYear(new Date().getFullYear())
    }
  }, [isOpen, selectedValues])

  const selectedMonthLabel = useMemo(
    () =>
      selectedValues
        .map(value => options.find(option => option.value === value.month)?.label)
        .filter(Boolean)
        .join(', '),
    [options, selectedValues]
  )

  const isMonthDisabled = (monthIndex: number) => {
    if (selectedYear < currentYear || selectedYear > maxYear) {
      return true
    }

    if (selectedYear === currentYear) {
      return monthIndex < currentMonth
    }

    // Next year is only allowed up to month before current month.
    return monthIndex >= currentMonth
  }

  const canGoPrevYear = selectedYear > currentYear
  const canGoNextYear = selectedYear < maxYear

  const togglePendingMonth = (value: string) => {
    const monthSelection = { month: value, year: selectedYear }
    const isAlreadySelected = pendingSelections.some(
      item => item.month === monthSelection.month && item.year === monthSelection.year
    )

    if (isAlreadySelected) {
      setPendingSelections(prev =>
        prev.filter(
          item => !(item.month === monthSelection.month && item.year === monthSelection.year)
        )
      )
      return
    }
    setPendingSelections(prev => [...prev, monthSelection])
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
          name="calendar-today"
          position="absolute"
          left="12px"
          top="12px"
          width="16px !important"
          color="gray.700"
          zIndex={1}
        />
        <Input
          type="text"
          value={selectedMonthLabel}
          placeholder={t`month`}
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
      <MenuList
        maxWidth={{ base: 'full', md: '420px' }}
        width={{ base: 'calc(100vw - 32px)', md: '420px' }}
        minW={{ base: 'calc(100vw - 32px)', md: "auto" }}
        mx={{ base: 4, md: 0 }}
        p="3"
      >
        <Flex align="center" justify="space-between" mb="3">
          <IconButton aria-label="Previous year" icon={<ChevronLeftIcon boxSize={5} color="gray.600" />} onClick={() => {
            if (canGoPrevYear) {
              setSelectedYear(prev => prev - 1)
            }
          }}
            variant="solid-gray"
            isDisabled={!canGoPrevYear}
            isActive={canGoPrevYear}
          />
          <Text size="sm" color="gray.800" fontWeight="500">
            {selectedYear}
          </Text>
          <IconButton aria-label="Next year" icon={<ChevronRightIcon boxSize={5} color="gray.600" />} onClick={() => {
            if (canGoNextYear) {
              setSelectedYear(prev => prev + 1)
            }
          }}
            variant="solid-gray"
            isDisabled={!canGoNextYear}
            isActive={canGoNextYear}
          />

        </Flex>
        <SimpleGrid columns={3} spacing="2">
          {options.map((option, index) => {
            const isSelected = pendingSelections.some(
              item => item.month === option.value && item.year === selectedYear
            )
            const isDisabled = isMonthDisabled(index)

            return (
              <MenuItem
                key={option.value}
                onClick={() => {
                  if (!isDisabled) {
                    togglePendingMonth(option.value)
                  }
                }}
                justifyContent="center"
                borderRadius="12px"
                fontSize="sm"
                py={3}
                border="1px solid"
                borderColor={isSelected ? 'blue.500' : 'gray.300'}
                transition="all 0.2s ease-in-out"
                bg={isSelected ? 'blue.500' : 'transparent'}
                color={isSelected ? 'white' : 'gray.700'}
                fontWeight="normal"
                isDisabled={isDisabled}
                opacity={isDisabled ? 0.5 : 1}
              >
                {option.label}
              </MenuItem>
            )
          })}
        </SimpleGrid>
        <Button mt="4" size="lg" width="full" onClick={() => onApply(pendingSelections)}>
          {t`confirm`}
        </Button>
      </MenuList>
    </Menu >
  )
}
