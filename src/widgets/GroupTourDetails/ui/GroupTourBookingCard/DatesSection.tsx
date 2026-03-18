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
            // base (mobile): no scrollbar at all
            scrollbarWidth: { base: 'none', md: 'none' },
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': {
              height: { base: 0, md: '6px' },
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'transparent',
              borderRadius: '999px',
            },
            // desktop hover: bring back colors so it becomes visible
            '@media (hover: hover)': {
              '&:hover': {
                scrollbarWidth: 'thin',
                msOverflowStyle: 'auto',
              },
              '&:hover::-webkit-scrollbar-track': {
                backgroundColor: 'gray.200',
              },
              '&:hover::-webkit-scrollbar-thumb': {
                backgroundColor: 'gray.400',
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

