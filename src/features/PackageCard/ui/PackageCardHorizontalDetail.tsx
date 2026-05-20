import { useTranslation } from 'react-i18next'
import {
  type DateTagProps,
  type PackageCardHorizontalDetailProps
} from './types'
import { useBreakpoint } from '@/shared/hooks'
import { Box, VStack, Flex, Tag, TagRightIcon, Show } from '@chakra-ui/react'
import { numberWithCommaNormalizer } from '@/utils/normalizers'
import { CURRENCY_MAP } from '@shared/model'
import { Button, Checkbox, Icon, Text, Tooltip } from '@ui'
import { getPluralForm } from '@shared/helpers'
import { formatNumber } from '@shared/utils'
import moment, { type Moment } from 'moment'

export const PackageCardHorizontalDetail = ({
  tourPackage,
  nights,
  isHotelPackage,
  childrenTravelers,
  isCompareSelected = false,
  isCompareDisabled = false,
  onCompareToggle,
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
    <Box width={{ base: 'auto', md: '254px' }} py="4" px={{ base: 4, md: 0 }}>
      <VStack align={{ base: 'start', md: 'start' }}>
        {isMd && (
          <>
            <CompareButton
              isChecked={isCompareSelected}
              isDisabled={isCompareDisabled}
              onToggle={onCompareToggle}
            />
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
            <Flex justify="flex-start" align="center" width="full" flexDirection="row" gap={2} px={{ base: 0, md: 4 }}>
              <PriceDisplay tourPackage={tourPackage} />
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
            <Flex justify="space-between" align="center" width="full" >
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

            <CompareButton
              isChecked={isCompareSelected}
              isDisabled={isCompareDisabled}
              onToggle={onCompareToggle}
            />
          </>
        )}
        <Box width="full"
          px={{ base: 0, md: 4 }}
        >
          <Button
            hidden={!isMd}
            width="full"
            px={3}
          >{t`learnMore`}</Button>
        </Box>
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
    <Text size="xs" fontWeight="medium" color="gray.600" px={{ base: 0, md: 4 }}>
      {tourPackage.adultTravelers}{' '}
      {t(getPluralForm(tourPackage.adultTravelers, 'adults'))}
      {childrenTravelers}
      <Show above="md">{' • '}</Show>
      <Show below="md">
        <Box as="br" display={{ base: 'block', md: 'none' }} />
      </Show>
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
    <Tag variant={tagVariant} px={3} rounded="full" mx={{ base: 0, md: 4 }}>
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


const CompareButton = ({
  isChecked,
  isDisabled,
  onToggle,
}: {
  isChecked: boolean
  isDisabled: boolean
  onToggle?: (isChecked: boolean) => void
}) => {
  const { t } = useTranslation()

  return (
    <Flex
      alignItems="center"
      gap={2}
      borderBottom={{ base: "0px solid", md: "1px solid" }}
      borderTop={{ base: "1px solid", md: "0px solid" }}
      borderColor={{ base: "gray.100", md: "gray.100" }}
      width="full"
      px={{ base: 0, md: 4 }}
      pt={{ base: 4, md: 0 }}
      pb={{ base: 0, md: 4 }}
      cursor={isDisabled ? "not-allowed" : "pointer"}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        if (isDisabled) return
        onToggle?.(!isChecked)
      }}
    >
      <Checkbox
        isChecked={isChecked}
        isDisabled={isDisabled}
        pointerEvents="none"
        onChange={() => undefined}
      />
      <Text size="xs" color="gray.600">
        {t`compare`}
      </Text>
    </Flex >
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
  <Flex alignItems="center">
    <Icon name="approximate" size="12" color="gray.600" />
    <Text size="xs" color="gray.600">
      {formatNumber(tourPackage.priceInCurrency)}{' '}
      {CURRENCY_MAP[tourPackage.currency]}
    </Text>
  </Flex>
)
