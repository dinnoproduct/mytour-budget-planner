import React from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { DatePickerCalendar } from '../DatePickerCalendar'
import { DatePickerConfirmButton } from '../DatePickerConfirmButton'

interface ExactDatesTabProps {
  selectedFromDate: Date | null
  selectedToDate: Date | null
  onDayClick: (date: Date) => void
  onAccept: () => void
}

export const ExactDatesTab: React.FC<ExactDatesTabProps> = ({
  selectedFromDate,
  selectedToDate,
  onDayClick,
  onAccept
}) => {
  const isDisabled = !selectedFromDate || !selectedToDate

  return (
    <Box height="full" maxHeight="full">
      <DatePickerCalendar
        onDayClick={onDayClick}
        selectedFromDate={selectedFromDate}
        selectedToDate={selectedToDate}
      />

      <Flex
        textAlign="right"
        height="80px"
        width="full"
        align="center"
        p={4}
        borderTop="1px solid"
        borderColor="gray.100"
        position={{ base: 'fixed', md: 'static' }}
        bottom={{ base: 0, md: undefined }}
      >
        <DatePickerConfirmButton onClick={onAccept} isDisabled={isDisabled} />
      </Flex>
    </Box>
  )
}

