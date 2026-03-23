import { Box, UnorderedList } from '@chakra-ui/react'
import { Text } from '@ui'
import moment from 'moment'
import { capitalize, formatNumber } from '@shared/utils'
import { ImagesSlider } from './ImagesSlider'
import { DetailsListItem } from './RequestCardDetailsListItem'
import type { RequestCardProps, RequestCardStatus } from './types'
import type { TFunction } from 'i18next'

type Props = {
  request: RequestCardProps['request']
  status: RequestCardStatus
  showBadge: boolean
  packageName: string
  cityLabel: string
  countryLabel: string
  roomType: string
  foodType?: string
  showNextPaymentFields: boolean
  totalTravelers: number | undefined
  t: TFunction
}

export const RequestCardMainInfo = ({
  request,
  status,
  showBadge,
  packageName,
  cityLabel,
  countryLabel,
  roomType,
  foodType,
  showNextPaymentFields,
  totalTravelers,
  t,
}: Props) => (
  <Box flex="1">
    <ImagesSlider
      images={request.hotel.images}
      starsCount={request.hotel.stars}
      status={status}
      showBadge={showBadge}
    />
    <Box py="4" px="4">
      <Text color="gray.800" size="sm" fontWeight="semibold" noOfLines={1}>
        {packageName}
      </Text>

      <Text size="sm" color="gray.600" mt="1">
        {cityLabel}, {countryLabel}
      </Text>

      <UnorderedList mx="0" mt="4" spacing="2">
        <DetailsListItem
          label={t`price`}
          value={`${formatNumber(request.price)} ֏`}
          tooltipText={
            request.remainingPaymentAmount !== 0 ? t`priceChangeText` : undefined
          }
        />

        {showNextPaymentFields && (
          <>
            <DetailsListItem
              label={t`paidAmount`}
              value={`${formatNumber(request.prePaymentAmount)} ֏`}
            />
            <DetailsListItem
              label={t`remainingPayment`}
              value={`${formatNumber(request.remainingPaymentAmount)} ֏`}
            />
            <DetailsListItem
              label={t`nextPayment`}
              value={moment(request.nextPaymentDate).format('DD.MM.YYYY')}
            />
          </>
        )}

        <DetailsListItem
          label={capitalize(t`traveler`)}
          value={totalTravelers ?? 0}
        />
        <DetailsListItem label={t`room`} value={roomType} />

        {foodType && (
          <DetailsListItem label={t`mealType`} value={foodType} />
        )}

        <DetailsListItem
          label={t`travelDates`}
          value={`${moment(request.startDate).format('DD.MM.YYYY')} - ${moment(
            request.endDate,
          ).format('DD.MM.YYYY')}`}
          isWithoutBorder
        />
      </UnorderedList>
    </Box>
  </Box>
)

