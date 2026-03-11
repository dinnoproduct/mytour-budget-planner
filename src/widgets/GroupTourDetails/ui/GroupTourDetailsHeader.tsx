import { Badge, Box, Flex } from '@chakra-ui/react'
import { Button, FlightDateBadge, Heading, Text } from '@ui'
import type { GroupTourInfo } from '@entities/package'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { LANGUAGE_PREFIX, type LanguageName } from '@shared/model'
import { GroupTourTagBadge } from '@shared/ui/components/Badge'
import { formatDate } from '@/widgets/PackageDetails/utils'
import moment from 'moment'

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

  const fromDate = useMemo(() => groupTour.departures[0]?.startDate
  ? moment(groupTour.departures[0].startDate)
  : null, [groupTour.departures]);
  
  const toDate = useMemo(() => groupTour.departures[0]?.endDate
    ? moment(groupTour.departures[0].endDate)
    : null, [groupTour.departures]);

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
          '& p': { color: 'gray.800', fontSize: 'md', lineHeight: 'md', fontWeight: '400' },
        }} />
        
      )}
      <Flex direction="row" alignItems={'center'} gap={1} mt={2}>
        {fromDate && toDate && (
          <Text size="sm" color="gray.800" >
            {formatDate(fromDate)} - {formatDate(toDate)}
          </Text>
        )}
        {(fromDate && toDate) && groupTour.departures[0]?.duration && (
          <Text size="sm" color="gray.800">•</Text>
        )}
        {groupTour.departures[0]?.duration && (
          <Text size="sm" color="gray.800">{t('daysQuantity.other', {day: groupTour.departures[0]?.duration})}</Text>
          )}
        </Flex>
      </Flex>
    </Flex>
  )
};
