import { Flex, FormControl, Text } from '@chakra-ui/react'
import type { GroupTourDeparture } from '@entities/package'
import { SectionTitle } from './SectionTitle'
import { CardDates } from './CardDates'
import { getDepartureMonthName, getDepartureDayRange } from '../../lib/utils'

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
              monthName={getDepartureMonthName(d.startDate)}
              dayRange={getDepartureDayRange(d.startDate, d.endDate)}
            />
          ))}
        </Flex>
      )}
    </FormControl>
  )
}

