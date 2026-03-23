import { Badge, Box, Flex } from '@chakra-ui/react'
import { Button, FlightDateBadge, Heading, Text } from '@ui'
import type { GroupTourInfo } from '@entities/package'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { LANGUAGE_PREFIX, type LanguageName } from '@shared/model'
import { GroupTourTagBadge } from '@shared/ui/components/Badge'
import moment from 'moment'
import { getValidDepartures } from '@/widgets/GroupTourDetails/lib/utils'

const getLocalized = (obj: { arm?: string; eng?: string; rus?: string } | undefined, lang: string) =>
  obj?.[lang as keyof typeof obj] || obj?.eng || ''

export const GroupTourDetailsHeader = ({
  groupTour,
  onMoreImagesClick,
}: {
  groupTour: GroupTourInfo
  onMoreImagesClick: () => void
}) => {
  const { t, i18n } = useTranslation()

  const languageSuffix = useMemo(
    () => (LANGUAGE_PREFIX[i18n.language as LanguageName] ?? 'eng').toLowerCase(),
    [i18n.language]
  )

  const groupName = useMemo(
    () => getLocalized(groupTour.name, languageSuffix),
    [groupTour.name, languageSuffix]
  )

  const routeSummary = useMemo(
    () => getLocalized(groupTour.routeSummary, languageSuffix),
    [groupTour.routeSummary, languageSuffix]
  )

  const formatDate = (date: moment.Moment) => {
    const longMonthName = date.locale("en").format("MMMM").toLowerCase();
    const shortMonthName = t(`${longMonthName}Short`);
    return `${shortMonthName} ${date.format("D")}`;
  };

  const firstValidDeparture = useMemo(() => {
    const valid = getValidDepartures(groupTour.departures);
    return valid[0] ?? groupTour.departures[0];
  }, [groupTour.departures]);

  const fromDate = useMemo(
    () =>
      firstValidDeparture?.startDate
        ? moment(firstValidDeparture.startDate)
        : null,
    [firstValidDeparture?.startDate],
  );

  const toDate = useMemo(
    () =>
      firstValidDeparture?.endDate
        ? moment(firstValidDeparture.endDate)
        : null,
    [firstValidDeparture?.endDate],
  );

  return (
    <Flex px={{ base: '4', md: '0' }}>
      <Flex direction="column" width="full">
        <Flex direction="row" alignItems={'center'} gap={2} mb={2} flexWrap="wrap">
        {groupTour.themeTags?.map((tag) => {
            const label = getLocalized(tag.name, languageSuffix)
            if (!label) return null
            return (
              <GroupTourTagBadge key={tag.id}>
                {label}
              </GroupTourTagBadge>
            )
          })}
          </Flex>
       <Flex direction="row" alignItems={'center'} gap={2}>
       <Heading
          as="h1"
          fontSize={{ base: '16px', md: '24px' }}
          color="gray.800"
          display="inline-block"
        >
          {groupName}
        </Heading>
        
       </Flex>
       

      {routeSummary && (
        <Box dangerouslySetInnerHTML={{ __html: routeSummary }} sx={{
          marginTop: 2,
          '& p': { color: 'gray.800', fontSize: 'md', lineHeight: 'md', fontWeight: '500' },
          '& strong': { fontWeight: '500' },
        }} />
        
      )}
      <Flex direction="row" alignItems={'center'} gap={1} mt={2}>
        {fromDate && toDate && (
          <Text size="sm" color="gray.800" >
            {formatDate(fromDate)} - {formatDate(toDate)}
          </Text>
        )}
        {(fromDate && toDate) && firstValidDeparture?.duration && (
          <Text size="sm" color="gray.800">•</Text>
        )}
        {firstValidDeparture?.duration && (
          <Text size="sm" color="gray.800">{t('daysQuantity.other', {day: firstValidDeparture.duration})}</Text>
          )}
        </Flex>
      </Flex>
    </Flex>
  )
};
