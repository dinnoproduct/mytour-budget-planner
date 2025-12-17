import React from 'react'
import { Box, MenuButton } from '@chakra-ui/react'
import { Icon } from '@ui'
import { DatePickerInput } from '../DatePickerInput'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { MENU_BUTTON_WIDTH } from '../constants'
import type { DatePickerCustomButtonProps } from '../types'

interface MenuButtonTriggerProps {
  isOpen: boolean
  inputFromDate: Date | null
  inputToDate: Date | null
  days?: number
  onOpen: () => void
  CustomButton?: React.ComponentType<DatePickerCustomButtonProps>
}

export const MenuButtonTrigger: React.FC<MenuButtonTriggerProps> = ({
  isOpen,
  inputFromDate,
  inputToDate,
  days,
  onOpen,
  CustomButton
}) => {
  if (CustomButton) {
    return (
      <MenuButton
        as={Box}
        sx={{
          span: {
            pointerEvents: 'auto'
          }
        }}
      >
        <CustomButton
          fromDate={inputFromDate as any}
          toDate={inputToDate as any}
          isFocused={isOpen}
          onClick={onOpen}
        />
      </MenuButton>
    )
  }

  return (
    <MenuButton
      position="relative"
      as={Box}
      width={MENU_BUTTON_WIDTH}
      onClick={onOpen}
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

      <DatePickerInput
        fromDate={inputFromDate as any}
        toDate={inputToDate as any}
        isFocused={isOpen}
        days={days}
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
  )
}

