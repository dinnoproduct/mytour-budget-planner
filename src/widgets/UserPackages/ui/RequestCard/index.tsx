import { useTranslation } from 'react-i18next'
import React, { useMemo } from 'react'
import { LANGUAGE_PREFIX } from '@shared/model'
import { type Language } from '@widgets/Header/model'
import {
  type DictionaryTypes,
  type PackageCity,
  type PackageCountry,
  RequestStatus,
  useDictionary,
} from '@entities/package'
import {
  type RequestCardProps,
  type RequestCardStatus,
} from '@widgets/UserPackages/ui/RequestCard/types.ts'
import { RequestsGroupStatus } from '@widgets/UserPackages/ui/types.ts'
import { useRequestPromoCode } from './useRequestPromoCode'
import { Layout } from './RequestCardLayout.tsx'
import { RequestCardMainInfo } from './RequestCardMainInfo.tsx'
import { RequestCardPromoToggle } from './RequestCardPromoToggle.tsx'
import { RequestCardPromoModal } from './RequestCardPromoModal.tsx'
import { RequestCardActions } from './RequestCardActions.tsx'

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
  const promo = useRequestPromoCode(request, t)
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

  return (
    <Layout {...props}>
      <RequestCardMainInfo
        request={request}
        status={request.status as RequestCardStatus}
        showBadge={showBadge}
        packageName={packageName}
        cityLabel={cityLabel}
        countryLabel={countryLabel}
        roomType={roomType}
        foodType={foodType}
        showNextPaymentFields={showNextPaymentFields}
        totalTravelers={totalTravelers}
        t={t}
      />

      <RequestCardPromoToggle
        showNotPaidButton={showNotPaidButton}
        promo={promo}
        t={t}
      />

      <RequestCardPromoModal
        showNotPaidButton={showNotPaidButton}
        promo={promo}
        t={t}
      />

      <RequestCardActions
        request={request}
        promo={promo}
        t={t}
        showRemainingPaymentButton={showRemainingPaymentButton}
        showContinueButton={showContinueButton}
        showNotPaidButton={showNotPaidButton}
        onRemainingPaymentClick={onRemainingPaymentClick}
        onContinueClick={onContinueClick}
        isLoadingRemainingPayment={isLoadingRemainingPayment}
        isLoadingContinue={isLoadingContinue}
      />
    </Layout>
  )
}
