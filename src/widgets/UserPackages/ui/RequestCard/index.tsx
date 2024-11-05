import {
  Box,
  type BoxProps,
  ListItem,
  MenuItem as ChakraMenuItem,
  type MenuItemProps,
  UnorderedList,
  VStack
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import React, { type ReactNode, useMemo } from 'react'
import { LANGUAGE_PREFIX } from '@shared/model'
import { type Language } from '@widgets/Header/model'
import { Button, Text } from '@ui'
import {
  type DictionaryTypes,
  type PackageCity,
  type PackageCountry,
  RequestStatus,
  useDictionary
} from '@entities/package'
import {
  type DetailsListItemProps,
  type RequestCardProps,
  type RequestCardStatus
} from '@widgets/UserPackages/ui/RequestCard/types.ts'
import { capitalize, formatNumber } from '@shared/utils'
import moment from 'moment'
import { ImagesSlider } from './ImagesSlider'

export const RequestCard = ({
  request = {},
  onRemainingPaymentClick,
  isLoadingRemainingPayment,
  onCancelClick,
  status,
  ...props
}: RequestCardProps) => {
  const { i18n, t } = useTranslation()

  const { data: roomTypes = [] } = useDictionary(
    'RoomTypeDictionary' as DictionaryTypes.RoomTypeDictionary
  )
  const roomType = useMemo(
    () =>
      roomTypes.find(roomType => roomType.key === request.roomType)
        ?.value as string,
    [roomTypes, request.roomType]
  )

  const showRequestActions = useMemo(
    () =>
      ['upcoming'].includes(status) &&
      ![
        RequestStatus.InProcess,
        RequestStatus.Rejected,
        RequestStatus.Overdue
      ].includes(request.status),
    [status]
  )

  const showPayButton = useMemo(
    () => status === 'upcoming' && request.status === RequestStatus.Booked,
    [status, request.remainingPaymentAmount]
  )

  const showNextPaymentFields = useMemo(
    () =>
      (status === 'upcoming' &&
        [
          RequestStatus.InProcess,
          RequestStatus.Rejected,
          RequestStatus.Overdue
        ].includes(request.status) &&
        request.remainingPaymentAmount > 0) ||
      RequestStatus.Booked === request.status,
    [status, request.status, request.remainingPaymentAmount]
  )

  const showBadge = useMemo(
    () => ['incomplete', 'upcoming'].includes(status),
    [status]
  )

  const languageSuffix = useMemo(
    () => LANGUAGE_PREFIX[i18n.language as Language['name']],
    [i18n.language]
  )

  const cityLabel = useMemo(
    () =>
      request.hotel.city[
        ('name' + languageSuffix) as keyof PackageCity
      ] as string,
    [request.hotel.city, languageSuffix]
  )

  const countryLabel = useMemo(
    () =>
      request.hotel.city.country[
        ('name' + languageSuffix) as keyof PackageCountry
      ] as string,
    [request.hotel.city.country, languageSuffix]
  )

  const packageName = useMemo(() => request.hotel.name, [request.hotel.name])

  return (
    <Layout {...props}>
      <Box flex="1">
        {' '}
        {/* Main content takes available space */}
        <ImagesSlider
          images={request.hotel.images}
          starsCount={request.hotel.stars}
          status={request.status as RequestCardStatus}
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
              value={request.travelers.length}
            />
            <DetailsListItem label={t`room`} value={roomType} />
            <DetailsListItem
              label={t`travelDates`}
              value={`${moment(request.startDate).format('DD.MM.YYYY')} - ${moment(request.endDate).format('DD.MM.YYYY')}`}
              isWithoutBorder
            />
          </UnorderedList>
        </Box>
      </Box>

      {showRequestActions && (
        <VStack px="4" pb="4" align="stretch" spacing="2">
          {showPayButton ? (
            <Button
              width="full"
              onClick={() =>
                onRemainingPaymentClick && onRemainingPaymentClick(request.id)
              }
              isLoading={isLoadingRemainingPayment}
            >
              {t`pay`} ({formatNumber(request.remainingPaymentAmount)} ֏)
            </Button>
          ) : null}

          <Button
            variant="solid-gray"
            onClick={() => onCancelClick && onCancelClick(request.id)}
            width="full"
          >
            {t`cancel`}
          </Button>
        </VStack>
      )}
    </Layout>
  )
}

const DetailsListItem = ({
  isWithoutBorder,
  label,
  value
}: DetailsListItemProps) => (
  <ListItem
    display="flex"
    justifyContent="space-between"
    borderBottom={isWithoutBorder ? 'none' : '1px solid'}
    borderColor="gray.100"
    pb={isWithoutBorder ? '0' : '2'}
  >
    <Text size="xs" color="gray.500">
      {label}
    </Text>

    <Text size="xs" color="gray.800" ml="2" align="end">
      {value}
    </Text>
  </ListItem>
)

const MenuItem = (props: MenuItemProps) => (
  <ChakraMenuItem
    bgColor="white"
    height="40px"
    px="4"
    _hover={{
      bgColor: 'gray.50'
    }}
    _active={{
      bgColor: 'gray.100'
    }}
    _focus={{
      bgColor: 'gray.100'
    }}
    _focusVisible={{
      bgColor: 'gray.100'
    }}
    fontSize="text-md"
    lineHeight="text-md"
    {...props}
  />
)

const Layout = ({
  children,
  ...props
}: { children: ReactNode | ReactNode[] } & BoxProps) => (
  <Box
    display="flex"
    flexDirection="column"
    justifyContent="space-between" // Ensures the top and bottom parts are spaced out
    maxWidth="362px"
    width="full"
    rounded="lg"
    overflow="hidden"
    border="1px solid"
    borderColor="gray.200"
    height="100%" // Ensures the layout fills available height
    {...props}
  >
    {children}
  </Box>
)
