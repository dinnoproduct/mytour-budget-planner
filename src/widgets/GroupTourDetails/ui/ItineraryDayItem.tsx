import { Box, Flex } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'
import { GroupTourDayBadge, Text } from '@ui'
import { CardSectionLayout } from '@/shared/ui/layout/CardSectionLayout'
import type { GroupTourItineraryDay } from '@entities/package'

type ItineraryDayItemProps = {
  day: GroupTourItineraryDay
  dayTitle: string
  dayDescription: string
}

export const ItineraryDayItem = ({ day, dayTitle, dayDescription }: ItineraryDayItemProps) => {
  const { t } = useTranslation()

  return (
    <CardSectionLayout mb={3} _last={{ mb: 0 }} padding="0px">
      <AccordionItem key={`${day.dayNumber}-${day.date}`} overflow="hidden" border="0px">
        <AccordionButton
          _hover={{ bg: 'transparent' }}
          _expanded={{ bg: 'transparent' }}
          justifyContent="space-between"
          alignItems="center"
          textAlign="left"
          p={4}
        >
          <Flex align="center" gap={3} flex={1} minW={0}>
            <GroupTourDayBadge>
              {t('day')} {day.dayNumber}
            </GroupTourDayBadge>
            <Text size="md" fontWeight="medium" color="gray.800" noOfLines={1}>
              {dayTitle}
            </Text>
          </Flex>
          <AccordionIcon flexShrink={0} size="sm" variant="solid-blue" color="gray.600" />
        </AccordionButton>
        <AccordionPanel px={4} pb={4} pt={2}>
          {dayDescription && (
            <Box
              color="gray.700"
              fontSize="sm"
              lineHeight="tall"
              sx={{
                '& p': { mt: 6 },
                '& p:first-child': { mt: 0 },
                '& ul, & ol': { pl: 4, my: 2 },
                '& li': { mb: 1 },
              }}
              dangerouslySetInnerHTML={{ __html: dayDescription }}
            />
          )}
        </AccordionPanel>
      </AccordionItem>
    </CardSectionLayout>
  )
}
