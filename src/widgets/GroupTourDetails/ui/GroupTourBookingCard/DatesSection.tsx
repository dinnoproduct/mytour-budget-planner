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
          sx={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
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

