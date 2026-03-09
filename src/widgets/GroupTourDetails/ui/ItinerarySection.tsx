import { Box } from '@chakra-ui/react'
import { Accordion } from '@chakra-ui/react'
import type { GroupTourItineraryDay } from '@entities/package'
import { getLocalized } from '../lib/utils'
import { ItineraryDayItem } from './ItineraryDayItem'

type ItinerarySectionProps = {
  itinerary: GroupTourItineraryDay[]
  languageSuffix: string
}

export const ItinerarySection = ({ itinerary, languageSuffix }: ItinerarySectionProps) => {
  if (!itinerary?.length) return null

  return (
    <Box mt="24px" px={{ base: '4', md: '0' }}>
      <Accordion allowMultiple={false} allowToggle defaultIndex={0}>
        {itinerary.map((day) => (
          <ItineraryDayItem
            key={`${day.dayNumber}-${day.date}`}
            day={day}
            dayTitle={getLocalized(day.title, languageSuffix)}
            dayDescription={getLocalized(day.description, languageSuffix)}
          />
        ))}
      </Accordion>
    </Box>
  )
}
