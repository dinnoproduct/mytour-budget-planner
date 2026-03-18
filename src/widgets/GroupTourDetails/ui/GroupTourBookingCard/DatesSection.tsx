import { Flex, FormControl, Text } from '@chakra-ui/react'
import type { GroupTourDeparture } from '@entities/package'
import { SectionTitle } from './SectionTitle'
import { CardDates } from './CardDates'
import { getDepartureMonthName, getDepartureDay } from '../../lib/utils'

type DatesSectionProps = {
  label: string
  noValidDepartures: boolean
  validDepartures: GroupTourDeparture[]
  selectedDepartureIndex: number
  onChangeSelectedDepartureIndex: (index: number) => void
  noAvailableLabel: string
}

export const DatesSection = ({
  label,
  noValidDepartures,
  validDepartures,
  selectedDepartureIndex,
  onChangeSelectedDepartureIndex,
  noAvailableLabel,
}: DatesSectionProps) => {
  const hasSelection =
    !noValidDepartures &&
    validDepartures.length > 0 &&
    selectedDepartureIndex >= 0 &&
    selectedDepartureIndex < validDepartures.length

  return (
    <FormControl
      isInvalid={!noValidDepartures && !hasSelection && validDepartures.length > 0}
      mb={4}
    >
      <SectionTitle title={label} />
      {noValidDepartures ? (
        <Text size="sm" color="red.500">
          {noAvailableLabel}
        </Text>
      ) : (
        <Flex
          flexWrap="nowrap"
          overflowX="auto"
          gap={2}
          pb={{ base: 0, md: 3 }}
          sx={{
            // hide scrollbar by default (all devices)
            '&:hover': {
                scrollbarWidth: { base: 'none', md: 'thin'},
                msOverflowStyle: 'auto',
              },
              '&:hover::-webkit-scrollbar': {
                display: 'block',
                height: { base: 0, md: '6px' },
              },
              '&:hover::-webkit-scrollbar-track': {
                backgroundColor: 'transparent',
              },
              '&:hover::-webkit-scrollbar-thumb': {
                backgroundColor: 'transparent',
                borderRadius: '999px',
              },
            // show thin scrollbar only on hover (desktop / pointer devices)
            '@media (hover: hover)': {
              '&:hover': {
                scrollbarWidth: { base: 'none', md: 'thin'},
                msOverflowStyle: 'auto',
              },
              '&:hover::-webkit-scrollbar': {
                display: 'block',
                height: { base: 0, md: '6px' },
              },
              '&:hover::-webkit-scrollbar-track': {
                backgroundColor: 'gray.200',
              },
              '&:hover::-webkit-scrollbar-thumb': {
                backgroundColor: 'gray.400',
                borderRadius: '999px',
              },
            },
          }}
        >
          {validDepartures.map((d, i) => (
            <CardDates
              key={`${d.startDate}-${i}`}
              isActive={selectedDepartureIndex === i}
              onClick={() => onChangeSelectedDepartureIndex(i)}
              flightMonth={getDepartureMonthName(d.startDate)}
              flightDay={getDepartureDay(d.startDate)}
              departureMonth={getDepartureMonthName(d.endDate)}
              departureDay={getDepartureDay(d.endDate)}
            />
          ))}
        </Flex>
      )}
    </FormControl>
  )
}

