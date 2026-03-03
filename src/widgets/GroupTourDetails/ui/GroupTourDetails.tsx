import { Flex } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { CardSectionLayout } from '@/shared/ui/layout/CardSectionLayout'
import type { GroupTourInfo } from '@entities/package'
import { LANGUAGE_PREFIX, type LanguageName } from '@shared/model'
import { getLocalized } from '../lib/utils'
import { IncludedExcludedSection } from './IncludedExcludedSection'
import { TourDescriptionSection } from './TourDescriptionSection'
import { ItinerarySection } from './ItinerarySection'

export const GroupTourDetails = ({ groupTour }: { groupTour: GroupTourInfo }) => {
  const { i18n } = useTranslation()

  const languageSuffix = useMemo(
    () => (LANGUAGE_PREFIX[i18n.language as LanguageName] ?? 'eng').toLowerCase(),
    [i18n.language]
  )

  const description = useMemo(
    () => getLocalized(groupTour.description, languageSuffix),
    [groupTour.description, languageSuffix]
  )

  return (
    <Flex
      direction="column"
      mt={{ base: 5, md: 0 }}
      flex="1 1 0"
      minW={0}
      width="full"
    >
      <CardSectionLayout>
        <IncludedExcludedSection
          included={groupTour.included}
          excluded={groupTour.excluded}
          languageSuffix={languageSuffix}
        />
        <TourDescriptionSection descriptionHtml={description} />
      </CardSectionLayout>
      <ItinerarySection itinerary={groupTour.itinerary ?? []} languageSuffix={languageSuffix} />
    </Flex>
  )
}
