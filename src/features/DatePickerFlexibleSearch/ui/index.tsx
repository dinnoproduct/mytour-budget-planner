import React from 'react'
import { Menu } from '@chakra-ui/react'
import { type DatePickerProps } from './types'
import { useDatePickerState } from './hooks/useDatePickerState'
import { useBreakpoint, useDisablePageScroll } from '@shared/hooks'
import { MenuButtonTrigger } from './components/MenuButtonTrigger'
import { DatePickerMenuContent } from './components/DatePickerMenuContent'

export const DatePickerFlexibleSearch: React.FC<DatePickerProps> = ({
  fromDate,
  toDate,
  onAccept,
  onOpenChange,
  CustomButton,
  menuProps,
  portalZIndex,
  exactDatesOnly,
  dateMode,
  setDateMode,
  searchDays,
}) => {
  const { isMd } = useBreakpoint()

  const {
    tabIndex,
    selectedFromDate,
    selectedToDate,
    isCalendarOpen,
    inputFromDate,
    inputToDate,
    days,
    searchData,
    handleDayClick,
    handleExactDateAccept,
    handleApproximateAccept,
    handleCalendarOpen,
    handleCalendarClose,
    handleTabChange
  } = useDatePickerState({
    fromDate,
    toDate,
    onAccept,
    dateMode,
    setDateMode,
    searchDays,
  })

  useDisablePageScroll(isCalendarOpen && !isMd)

  React.useEffect(() => {
    onOpenChange?.(isCalendarOpen)
  }, [isCalendarOpen, onOpenChange])

  return (
    <Menu
      isOpen={isCalendarOpen}
      onClose={handleCalendarClose}
      offset={[0, 4]}
      {...menuProps}
    >
      <MenuButtonTrigger
        isOpen={isCalendarOpen}
        inputFromDate={inputFromDate}
        inputToDate={inputToDate}
        days={days}
        onOpen={handleCalendarOpen}
        CustomButton={CustomButton}
      />

      <DatePickerMenuContent
        isOpen={isCalendarOpen}
        tabIndex={tabIndex}
        selectedFromDate={selectedFromDate}
        selectedToDate={selectedToDate}
        searchData={searchData}
        onClose={handleCalendarClose}
        onDayClick={handleDayClick}
        onExactDateAccept={handleExactDateAccept}
        onApproximateAccept={handleApproximateAccept}
        onTabChange={handleTabChange}
        portalZIndex={portalZIndex}
        exactDatesOnly={exactDatesOnly}
      />
    </Menu>
  )
}
