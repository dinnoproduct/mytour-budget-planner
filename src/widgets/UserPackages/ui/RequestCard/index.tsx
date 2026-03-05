import {
  Box,
  type BoxProps,
  Flex,
  ListItem,
  MenuItem as ChakraMenuItem,
  type MenuItemProps,
  UnorderedList,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import React, { type ReactNode, useMemo, useState } from 'react'
import { LANGUAGE_PREFIX } from '@shared/model'
import { type Language } from '@widgets/Header/model'
import { Button, Icon, Text, Tooltip, Input } from '@ui'
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
import { RequestsGroupStatus } from '@widgets/UserPackages/ui/types.ts'
import { Switch } from '@/components/Switch'
import { useValidatePromoCode } from '@entities/package'

export const RequestCard = ({
  request,
  onRemainingPaymentClick,
  isLoadingRemainingPayment,
  onCancelClick,
  status,
  isLoadingContinue,
  onContinueClick,
  cancellingRequestId,
  ...props
}: RequestCardProps) => {
  const { i18n, t } = useTranslation()
  const [hasPromoCode, setHasPromoCode] = useState(false)
  const [promoCode, setPromoCode] = useState<string>('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [discountedRemainingAmount, setDiscountedRemainingAmount] = useState<number | null>(null)
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false)

  const validatePromoCode = useValidatePromoCode()

  const { data: roomTypes = [] } = useDictionary(
    'RoomTypeDictionary' as DictionaryTypes.RoomTypeDictionary
  )

  const { data: foodTypes = [] } = useDictionary(
    'FoodTypeDictionary' as DictionaryTypes.FoodTypeDictionary
  )

  const roomType = useMemo(
    () =>
      roomTypes.find(roomType => roomType.key === request.roomType)
        ?.value as string,
    [roomTypes, request.roomType]
  )

  const foodType = useMemo(
    () =>
      foodTypes.find(foodType => foodType.key === request.foodType)
        ?.value as string,
    [foodTypes, request.foodType]
  )

  const showRemainingPaymentButton = useMemo(
    () =>
      status === RequestsGroupStatus.Upcoming &&
      [RequestStatus.Booked].includes(request.status),
    [status, request.remainingPaymentAmount]
  )

  const showContinueButton = useMemo(
    () =>
      status === RequestsGroupStatus.Incomplete &&
      request.status === RequestStatus.Draft &&
      new Date(request.startDate) > new Date(),
    [status, request.status, request.startDate]
  )

  const showNotPaidButton = useMemo(
    () =>
      (status === RequestsGroupStatus.Incomplete &&
        request.status === RequestStatus.NotPaid) ||
      (request.status === RequestStatus.Reserved &&
        status === RequestsGroupStatus.Upcoming),
    [status, request.status]
  )

  const showNextPaymentFields = useMemo(
    () =>
      (status === RequestsGroupStatus.Upcoming &&
        [
          RequestStatus.InProcess,
          RequestStatus.Rejected,
          RequestStatus.Overdue
        ].includes(request.status) &&
        request.remainingPaymentAmount > 0) ||
      [RequestStatus.Booked, RequestStatus.Reserved].includes(request.status),
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

  const totalTravelers = useMemo(
    () => request.travelers.length || request.notes?.totalTravelersCount,
    [request.travelers.length, request.notes?.totalTravelersCount]
  )

  const handleApplyPromoForRequest = () => {
    if (!promoCode.trim()) {
      setPromoError(t`promoCodeValidationFailed`)
      return
    }

    setPromoError(null)
    validatePromoCode.mutate(
      {
        promoCode,
        offerId: 0,
        travelAgencyId: request.travelAgencyId,
        price: request.remainingPaymentAmount,
        agencyId: request.travelAgencyId,
        hotelId: request.hotel.id,
        startDate: request.startDate,
        bookingType: request.bookingType,
        prePaymentAmount: request.prePaymentAmount
      } as any,
      {
        onSuccess: (res: any) => {
          if (res?.success && typeof res?.finalAmount === 'number') {
            setPromoApplied(true)
            setDiscountedRemainingAmount(res.finalAmount)
            setIsPromoModalOpen(false)
          } else {
            setPromoApplied(false)
            setDiscountedRemainingAmount(null)
            setPromoError(t`promoCodeValidationFailed`)
          }
        },
        onError: () => {
          setPromoApplied(false)
          setDiscountedRemainingAmount(null)
          setPromoError(t`promoCodeValidationFailed`)
        }
      }
    )
  }

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
              tooltipText={request.remainingPaymentAmount !== 0 ? t`priceChangeText` : undefined}
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
              value={totalTravelers}
            />
            <DetailsListItem label={t`room`} value={roomType} />

            {foodType && (
              <DetailsListItem label={t`mealType`} value={foodType} />
            )}

            <DetailsListItem
              label={t`travelDates`}
              value={`${moment(request.startDate).format('DD.MM.YYYY')} - ${moment(request.endDate).format('DD.MM.YYYY')}`}
              isWithoutBorder
            />
          </UnorderedList>
        </Box>
      </Box>

      {showNotPaidButton && (
        <Flex p={3} mx={4} border={'1px solid'} borderColor={'gray.100'} rounded={'lg'} justify="space-between" align="center">
          <Text size="sm" fontWeight={'semibold'} color="gray.800" mt="1">
            {t`iHavePromoCode`}
          </Text>
          <Switch
            isChecked={hasPromoCode}
            isDisabled={validatePromoCode.isPending}
            onChange={() => {
              if (!hasPromoCode) {
                setHasPromoCode(true)
                setIsPromoModalOpen(true)
              } else {
                setHasPromoCode(false)
                setPromoApplied(false)
                setPromoCode('')
                setPromoError(null)
                setDiscountedRemainingAmount(null)
              }
            }}
          />
        </Flex>
      )}

      {showNotPaidButton && (
        <Modal
          isOpen={isPromoModalOpen}
          onClose={() => {
            setIsPromoModalOpen(false)
            // if nothing applied yet, also reset switch
            if (!promoApplied) {
              setHasPromoCode(false)
              setPromoCode('')
              setPromoError(null)
            }
          }}
          isCentered
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{t`usePromoCode`}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                value={promoCode}
                onChange={(e: any) => setPromoCode(e.target.value)}
                state={promoError ? 'invalid' : 'default'}
                placeholder={t`promoCodePlaceholder`}
              />
              {promoError && (
                <Text size="xs" color="red.500" mt={2}>
                  {promoError}
                </Text>
              )}
            </ModalBody>
            <ModalFooter gap={2}>
              <Button
                variant="outline-blue"
                size="sm"
                onClick={() => {
                  setIsPromoModalOpen(false)
                  if (!promoApplied) {
                    setHasPromoCode(false)
                    setPromoCode('')
                    setPromoError(null)
                  }
                }}
              >
                {t`back`}
              </Button>
              <Button
                variant="solid-blue"
                size="sm"
                isLoading={validatePromoCode.isPending}
                onClick={() => {
                  handleApplyPromoForRequest()
                  // close modal on successful apply will be done in handler
                }}
              >
                {t`apply`}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {(showRemainingPaymentButton ||
        showContinueButton ||
        showNotPaidButton) && (
        <VStack px="4" pb="4" align="stretch" spacing="2">
          {(showRemainingPaymentButton || showNotPaidButton) &&
          <Flex justify="space-between" align="center" pt={4} mb={2} mt={4} borderTop={'1px solid'} borderColor={'gray.100'} >
            <Text size="xs" color="gray.600" fontWeight="normal"  >
              {t`remainingPayment`}
            </Text>
            <Flex align="center" gap={2}>
              {promoApplied && discountedRemainingAmount !== null && (
                <Text size="xs" color="#FE3A5D" fontWeight="medium" textDecoration="line-through">
                  {formatNumber(request.remainingPaymentAmount)}֏
                </Text>
              )}
              <Text size="md" color="black" fontWeight="bold">
                {formatNumber(
                  promoApplied && discountedRemainingAmount !== null
                    ? discountedRemainingAmount
                    : request.remainingPaymentAmount
                )}֏
              </Text>
            </Flex>
          </Flex>}
          {(showRemainingPaymentButton || showNotPaidButton) ? (
            <Button
              width="full"
              onClick={() => showRemainingPaymentButton ?
                onRemainingPaymentClick && onRemainingPaymentClick(request) : 
                onContinueClick && onContinueClick(request)
              }
              isLoading={isLoadingRemainingPayment || isLoadingContinue}
            >
              {t`pay`}
            </Button>
          ) : null}

          {showContinueButton ? (
            <Button
              width="full"
              onClick={() => onContinueClick && onContinueClick(request)}
              isLoading={isLoadingContinue}
            >
              {t`continue`}
            </Button>
          ) : null}         
        </VStack>
      )}
    </Layout>
  )
}

const DetailsListItem = ({
  isWithoutBorder,
  label,
  value,
  tooltipText
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

    <Flex align="center">
      <Text size="xs" color="gray.800" ml="2" align="end">
        {value}
      </Text>

      {tooltipText ? (
        <Tooltip label={tooltipText}>
          <Flex justify="center" align="center">
            <Icon name="info-outline" size="16" color="gray.800" ml="1" />
          </Flex>
        </Tooltip>
      ) : null}
    </Flex>
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
