import { useTranslation } from 'react-i18next'
import {
  type DateTagProps,
  type PackageCardHorizontalDetailProps
} from './types'
import { useBreakpoint } from '@/shared/hooks'
import { Box, VStack, Flex, Tag, TagRightIcon } from '@chakra-ui/react'
import { numberWithCommaNormalizer } from '@/utils/normalizers.ts'
import { CURRENCY_MAP } from '@shared/model'
import { Button, Icon, Text, Tooltip } from '@ui'
import { Link as ReactLink } from 'react-router-dom'
import { getPluralForm } from '@shared/helpers'
import { formatNumber } from '@shared/utils'
import moment, { type Moment } from 'moment'

export const PackageCardHorizontalDetail = ({
  tourPackage,
  nights,
  link,
  isHotelPackage,
  childrenTravelers
}: PackageCardHorizontalDetailProps) => {
  const { t } = useTranslation()
  const { isMd } = useBreakpoint()

  const fromDate = moment(
    isHotelPackage
      ? tourPackage.checkin
      : tourPackage.destinationFlight.departureDate
  )
  const toDate = moment(
    isHotelPackage ? tourPackage.checkout : tourPackage.returnFlight.arrivalDate
  )

  return (
    <Box width={{ base: 'auto', md: '254px' }} p="4">
      <VStack align={{ base: 'start', md: 'end' }}>
        {isMd && (
          <>
            <DateTag
              fromDate={fromDate}
              toDate={toDate}
              nights={nights}
              tourPackage={tourPackage}
            />
            <TravelersAndNightsInfo
              tourPackage={tourPackage}
              childrenTravelers={childrenTravelers}
            />
            <PriceDisplay tourPackage={tourPackage} />
            <Flex height="28px" align="center">
              <ApproximatePriceDisplay tourPackage={tourPackage} />
            </Flex>
          </>
        )}
        {!isMd && (
          <>
            <Flex justify="space-between" align="start" width="full">
              <TravelersAndNightsInfo
                tourPackage={tourPackage}
                childrenTravelers={childrenTravelers}
              />

              <DateTag
                fromDate={fromDate}
                toDate={toDate}
                nights={nights}
                tourPackage={tourPackage}
              />
            </Flex>

            <Flex justify="space-between" align="center" width="full">
              <Text size="xs" color="gray.600">
                {t`startFrom`}
              </Text>
              <Flex height="28px" align="center" gap={3}>
                <Text size="lg" fontWeight="bold" color="gray.800">
                  {numberWithCommaNormalizer(tourPackage.price)} ֏
                </Text>

                <Flex align="center">
                  <ApproximatePriceDisplay tourPackage={tourPackage} />
                </Flex>
              </Flex>
            </Flex>
          </>
        )}

        <Button
          hidden={!isMd}
          as={ReactLink}
          to={link}
          width="full"
          px={3}
        >{t`book`}</Button>
      </VStack>
    </Box>
  )
}

const TravelersAndNightsInfo = ({
  tourPackage,
  childrenTravelers
}: Pick<
  PackageCardHorizontalDetailProps,
  'tourPackage' | 'childrenTravelers'
>) => {
  const { t } = useTranslation()

  return (
    <Text size="xs" fontWeight="medium" color="gray.600">
      {tourPackage.adultTravelers}{' '}
      {t(getPluralForm(tourPackage.adultTravelers, 'adults'))}
      {childrenTravelers}
      <br />
      {tourPackage.nights} {t(getPluralForm(tourPackage.nights, 'nights'))}
    </Text>
  )
}

const DateTag = ({ tourPackage, fromDate, toDate, nights }: DateTagProps) => {
  const { t } = useTranslation()

  const isNightsAreEqual = nights === tourPackage.nights
  const tagVariant = isNightsAreEqual ? 'subtle-success' : 'subtle-warning'
  const day = nights + 1
  const label = t(getPluralForm(day, 'noMatchingPackage'), {
    day
  })

  const formatDate = (date: Moment) => {
    const longMonthName = date.locale('en').format('MMMM').toLowerCase()
    const shortMonthName = t(`${longMonthName}Short`)

    return `${shortMonthName} ${date.format('D')}`
  }

  return (
    <Tag variant={tagVariant} px={3} rounded="full">
      {formatDate(fromDate)} - {formatDate(toDate)}
      {!isNightsAreEqual && (
        <Tooltip
          label={label}
          fontSize="md"
          width="280px"
          placement="top-start"
        >
          <Box display="flex" justifyContent="center" as="span" ml={1}>
            <TagRightIcon as={Icon} name="info-outline" size="16" ml={0} />
          </Box>
        </Tooltip>
      )}
    </Tag>
  )
}

const PriceDisplay = ({
  tourPackage
}: Pick<PackageCardHorizontalDetailProps, 'tourPackage'>) => {
  const { t } = useTranslation()

  return (
    <Flex alignItems="center" gap={1}>
      <Text size="xs" color="gray.600">
        {t`startFrom`.toLowerCase()}
      </Text>
      <Text size="lg" fontWeight="bold" color="gray.800">
        {numberWithCommaNormalizer(tourPackage.price)} ֏
      </Text>
    </Flex>
  )
}

const ApproximatePriceDisplay = ({
  tourPackage
}: Pick<PackageCardHorizontalDetailProps, 'tourPackage'>) => (
  <>
    <Icon name="approximate" size="12" color="gray.600" />
    <Text size="xs" color="gray.600" ml="0.5">
      {formatNumber(parseFloat(tourPackage.priceInCurrency))}{' '}
      {CURRENCY_MAP[tourPackage.currency]}
    </Text>
  </>
)
