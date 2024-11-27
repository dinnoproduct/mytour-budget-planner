import { Box, Flex } from '@chakra-ui/react'
import { Button, Text } from '@ui'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { type DatePickerFlightsCustomButtonProps } from '@features/DatePickerFlights'

export const FlightsConfigButton = ({
  fromDate,
  toDate,
  onClick,
  isFocused
}: DatePickerFlightsCustomButtonProps) => {
  const { t, i18n } = useTranslation()

  const formatDate = (date?: Date) => {
    if (!date) {
      return ''
    }

    const longMonthName = date
      .toLocaleString('en-US', { month: 'long' })
      .toLowerCase()
    const shortMonthName = t(`${longMonthName}Short`)

    return `${shortMonthName} ${date.getDate()}, ${date.getFullYear()}`
  }

  const inputValue = useMemo(() => {
    if (!fromDate || !toDate) {
      return ''
    }

    return `${formatDate(fromDate)} • ${formatDate(toDate)}`
  }, [fromDate, toDate, i18n.language])

  return (
    <Box px="4">
      <Flex align="center" justify="space-between">
        <Text color="gray.600" size="sm" fontWeight="400">
          {t`duration`}
        </Text>

        <Button size="sm" icon="edit" variant="text-blue" onClick={onClick} />
      </Flex>

      <Text fontWeight="500" size="sm" mt="1">
        {inputValue}
      </Text>
    </Box>
  )
}
