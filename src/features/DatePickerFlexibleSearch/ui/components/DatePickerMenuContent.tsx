import React from 'react'
import { MenuList, Portal } from '@chakra-ui/react'
import { Tabs } from '@ui'
import { useTranslation } from 'react-i18next'
import { useBreakpoint } from '@shared/hooks'
import { MobileHeader } from './MobileHeader'
import { ExactDatesTab } from './ExactDatesTab'
import { ApproximateDatesTab } from './ApproximateDatesTab'
import { MENU_LIST_MOBILE_ROOT_PROPS } from '../constants'
import { Box } from '@chakra-ui/react'

interface DatePickerMenuContentProps {
  isOpen: boolean
  tabIndex: number
  selectedFromDate: Date | null
  selectedToDate: Date | null
  searchData: {
    days?: number
    toDate?: Date | null
  }
  onClose: () => void
  onDayClick: (date: Date) => void
  onExactDateAccept: () => void
  onApproximateAccept: (data: {
    dateFrom: Date
    dateTo: Date
    days: number
  }) => void
  onTabChange: (index: number) => void
  portalZIndex?: number
}

export const DatePickerMenuContent: React.FC<DatePickerMenuContentProps> = ({
  isOpen,
  tabIndex,
  selectedFromDate,
  selectedToDate,
  searchData,
  onClose,
  onDayClick,
  onExactDateAccept,
  onApproximateAccept,
  onTabChange,
  portalZIndex
}) => {
  const { t } = useTranslation()
  const { isMd } = useBreakpoint()

  return (
    <Portal>
      <MenuList
        pt={{ base: '0', md: '10px' }}
        pb={0}
        borderRadius={{ base: '0', md: 'xl' }}
        border="none"
        minWidth="auto"
        height="full"
        width="full"
        maxW={{ base: '100dvw', md: '392px' }}
        rootProps={
          !isMd
            ? MENU_LIST_MOBILE_ROOT_PROPS
            : portalZIndex
              ? { zIndex: portalZIndex }
              : {}
        }
      >
        <MobileHeader onClose={onClose} />
        <Tabs
          align="center"
          variant="grey-segment"
          labels={[t`fixedDates`, t`flexibleDates`]}
          size="sm"
          index={tabIndex}
          onChange={onTabChange}
        >
          <ExactDatesTab
            selectedFromDate={selectedFromDate}
            selectedToDate={selectedToDate}
            onDayClick={onDayClick}
            onAccept={onExactDateAccept}
          />

          <ApproximateDatesTab
            searchData={searchData}
            isResetState={isOpen}
            onConfirm={onApproximateAccept}
          />
        </Tabs>
      </MenuList>
    </Portal>
  )
}

