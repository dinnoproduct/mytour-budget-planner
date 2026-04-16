import React, { useState, useEffect, useMemo } from 'react'
import { Box, Flex, Menu, MenuButton, MenuList, Portal } from '@chakra-ui/react'
import { type DatePickerProps, type DateSelectState } from './types'
import { DatePickerInput } from './DatePickerInput'
import { DatePickerCalendar } from './DatePickerCalendar'
import { DatePickerHeader } from './DatePickerHeader'
import {Button, Icon, Text} from '@ui'
import { useTranslation } from 'react-i18next'
import { useBreakpoint } from '@shared/hooks'
import { DatePickerFooter } from '@features/DatePickerFlights/ui/DatePickerFooter'
import {ChevronRightIcon} from "@chakra-ui/icons";

export const DatePickerFlights = ({
  fromDate,
  toDate,
  onAccept,
  availableDepartureDates,
  availableReturnDates,
  isLoadingReturnDates,
  onFromDateClick,
  menuProps = {},
  CustomButton,
  portalZIndex
}: DatePickerProps) => {
  const { t } = useTranslation()
  const [selectedFromDate, setSelectedFromDate] = useState<Date | null>(null)
  const [selectedToDate, setSelectedToDate] = useState<Date | null>(null)
  const [isCalendarOpen, setCalendarOpen] = useState(false)
  const [inputFromDate, setInputFromDate] = useState<Date | null>(null)
  const [inputToDate, setInputToDate] = useState<Date | null>(null)
  const [dateSelectState, setDateSelectState] =
    useState<DateSelectState>('from') // New state for tracking focused input

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

  // Memoize availableDates to avoid recreating on every render
  // Only update when dateSelectState changes or when the actual date arrays change
  const availableDates = useMemo(() => {
    if (dateSelectState === 'from') {
      return availableDepartureDates
    } else if (
      dateSelectState === 'to' &&
      !isLoadingReturnDates &&
      availableReturnDates?.length
    ) {
      return availableReturnDates || []
    }
    return []
  }, [
    dateSelectState,
    availableDepartureDates,
    availableReturnDates,
    isLoadingReturnDates
  ])

  const handleDayClick = (date: Date) => {
    if (dateSelectState === 'from') {
      setSelectedFromDate(date)
      onFromDateClick(date)
      setSelectedToDate(null)
      setDateSelectState('to')
    } else if (dateSelectState === 'to' && date >= selectedFromDate!) {
      setSelectedToDate(date)
    }
  }

  const handleAccept = () => {
    if (selectedFromDate && selectedToDate) {
      onAccept(selectedFromDate, selectedToDate)
      setInputFromDate(selectedFromDate)
      setInputToDate(selectedToDate)
      setCalendarOpen(false)
      setDateSelectState('from')
    }
  }

  const handleCalendarOpen = () => {
    setCalendarOpen(true)
    setDateSelectState('from')
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
          position='relative'
          as={Box}
          width={{
            base: 'full',
            md: '350px',
            lg: '320px'
          }}
          onClick={handleCalendarOpen}
          cursor="pointer"
          role="group"
        >
          <Icon
            name="calendar-today"
            position="absolute"
            left='12px'
            top='12px'
            width='16px !important'
            color="gray.700"
            zIndex={1}/>

          <DatePickerInput
            fromDate={inputFromDate as any}
            toDate={inputToDate as any}
            isFocused={isCalendarOpen}
          />

          <ChevronRightIcon
            position="absolute"
            right='12px'
            top='14px'
            height='20px'
            width='20px'
            style={{rotate: '90deg'}}
            transform={isCalendarOpen ? 'rotate(180deg)' : ''}
            color='gray.700'
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
              : portalZIndex
                ? { zIndex: portalZIndex }
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
          >
            <Text size="md" fontWeight="semibold">
              {t`duration`}
            </Text>

            <Button
              icon="close"
              aria-label="Close calendar"
              variant="solid-gray"
              size="lg"
              onClick={() => setCalendarOpen(false)}
            />
          </Flex>

          <DatePickerHeader
            fromDate={selectedFromDate}
            toDate={selectedToDate}
            dateSelectState={dateSelectState}
            onFromTabClick={() => setDateSelectState('from')}
          />

          <DatePickerCalendar
            availableDates={availableDates}
            onDayClick={handleDayClick}
            selectedFromDate={selectedFromDate}
            selectedToDate={selectedToDate}
            isLoading={isLoadingReturnDates}
            dateSelectState={dateSelectState}
          />

          <DatePickerFooter
            onConfirm={handleAccept}
            isConfirmDisabled={!selectedFromDate || !selectedToDate}
            fromDate={selectedFromDate}
            toDate={selectedToDate}
          />
        </MenuList>
      </Portal>
    </Menu>
  )
}
