import React, { useState, useEffect } from 'react'
import { Box, Flex, Menu, MenuButton, MenuList, Portal } from '@chakra-ui/react'
import { type DatePickerProps } from './types.ts'
import { DatePickerInput } from './DatePickerInput.tsx'
import { DatePickerCalendar } from './DatePickerCalendar.tsx'
import { DatePickerConfirmButton } from './DatePickerConfirmButton.tsx'
import { Button, Text } from '@ui'
import { useTranslation } from 'react-i18next'
import { useBreakpoint } from '@shared/hooks'

export const DatePicker = ({
  fromDate,
  toDate,
  onAccept,
  CustomButton,
  menuProps
}: DatePickerProps) => {
  const { t } = useTranslation()
  const [selectedFromDate, setSelectedFromDate] = useState<Date | null>(null)
  const [selectedToDate, setSelectedToDate] = useState<Date | null>(null)
  const [isCalendarOpen, setCalendarOpen] = useState(false)
  const [inputFromDate, setInputFromDate] = useState<Date | null>(null)
  const [inputToDate, setInputToDate] = useState<Date | null>(null)

  const { isMd } = useBreakpoint()

  useEffect(() => {
    if (fromDate) {
      setSelectedFromDate(fromDate)
      setInputFromDate(fromDate)
    }

    if (toDate) {
      setSelectedToDate(toDate)
      setInputToDate(toDate)
    }
  }, [fromDate, toDate])

  useEffect(() => {
    if (isCalendarOpen) {
      setSelectedFromDate(inputFromDate)
      setSelectedToDate(inputToDate)

      if (!isMd) {
        document.body.style.overflow = 'hidden'
      }
    } else {
      document.body.style.overflow = ''
    }
  }, [isCalendarOpen, inputFromDate, inputToDate, isMd])

  const handleDayClick = (date: Date) => {
    if (!selectedFromDate || (selectedFromDate && selectedToDate)) {
      setSelectedFromDate(date)
      setSelectedToDate(null)
    } else if (selectedFromDate && !selectedToDate) {
      if (date < selectedFromDate) {
        setSelectedFromDate(date)
      } else {
        setSelectedToDate(date)
      }
    }
  }

  const handleAccept = () => {
    if (selectedFromDate && selectedToDate) {
      onAccept(selectedFromDate, selectedToDate)
      setInputFromDate(selectedFromDate)
      setInputToDate(selectedToDate)
      setCalendarOpen(false)
    }
  }

  const handleCalendarOpen = () => {
    setCalendarOpen(true)
  }

  return (
    <Menu
      isOpen={isCalendarOpen}
      onClose={() => setCalendarOpen(false)}
      offset={[0, 4]}
      {...menuProps}
    >
      {CustomButton ? (
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
            isFocused={isCalendarOpen}
            onClick={handleCalendarOpen}
          />
        </MenuButton>
      ) : (
        <MenuButton
          as={Box}
          width={{
            base: 'full',
            md: '350px',
            lg: '320px'
          }}
          onClick={handleCalendarOpen}
          cursor="pointer"
        >
          <DatePickerInput
            fromDate={inputFromDate as any}
            toDate={inputToDate as any}
            isFocused={isCalendarOpen}
          />
        </MenuButton>
      )}

      <Portal>
        <MenuList
          p={0}
          borderRadius={{ base: '0', md: 'xl' }}
          border="none"
          minWidth="fit-content"
          height="full"
          width="full"
          rootProps={
            !isMd
              ? {
                  position: { base: 'fixed !important' as any, md: undefined },
                top: { base: '80px !important', md: undefined },
                  left: { base: '0 !important', md: undefined },
                right: { base: '0 !important', md: undefined },
                  bottom: { base: '0 !important', md: undefined },
                  height: {
                    base: 'calc(100dvh - 80px) !important',
                    md: undefined
                  },
                  zIndex: { base: '100000 !important', md: undefined },
                overflowY: { base: 'auto !important' as any, md: undefined },
                width: { base: '100dvw !important', md: undefined },
                transform: {
                  base: 'translate3d(0px, 0px, 0px) !important',
                  md: undefined
                }
                }
              : {}
          }
        >
          <Flex
            display={{ base: 'flex', md: 'none' }}
            justify="space-between"
            px="4"
            height="64px"
            align="center"
            width="full"
            borderBottom="1px solid"
            borderColor="gray.100"
          >
            <Text size="md" fontWeight="semibold">{t`duration`}</Text>

            <Button
              icon="close"
              aria-label="Close calendar"
              variant="solid-gray"
              size="lg"
              onClick={() => setCalendarOpen(false)}
            />
          </Flex>

          <DatePickerCalendar
            onDayClick={handleDayClick}
            selectedFromDate={selectedFromDate}
            selectedToDate={selectedToDate}
          />

          <Flex
            textAlign="right"
            height="80px"
            width="full"
            align="center"
            px="8"
            justify="flex-end"
            borderTop="1px solid"
            borderColor="gray.100"
            position={{ base: 'fixed', md: 'static' }}
            bottom={{ base: 0, md: undefined }}
          >
            <DatePickerConfirmButton onClick={handleAccept} />
          </Flex>
        </MenuList>
      </Portal>
    </Menu>
  )
}
