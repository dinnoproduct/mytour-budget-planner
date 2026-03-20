import { useMemo } from 'react'
import type {
  NormalizedRequestEntity,
  PackageEntity,
  GroupTourInfo
} from '@entities/package'
import { useGroupTourOfferPrice } from './useGroupTourOfferPrice'
import { useGroupTourInfo } from './useGroupTourInfo'

/**
 * For a group tour request (bookingType === 3, groupTourId): fetches tour by id
 * (getGroupTourInfo), calls createGroupTourOffer for price, then returns package
 * details shaped for BookingFlow so continue goes to booking flow with full tour data.
 */
export function useGroupTourPackageFromRequest(
  request: NormalizedRequestEntity | null,
  options?: { enabled?: boolean }
) {
  const tourId = request
    ? (typeof (request as any).groupTourId === 'string'
        ? (request as any).groupTourId
        : undefined)
    : undefined

  const enabled =
    (options?.enabled !== false &&
      !!request?.id &&
      (request!.bookingType === 3 || !!tourId) &&
      !!tourId) as boolean

  const { data: groupTour, isLoading: isLoadingGroupTour } =
    useGroupTourInfo(tourId ?? undefined, { enabled: enabled && !!tourId })

  const adultCount = request?.notes?.adultTravelersCount ?? 0
  const childCount =
    (request?.notes as any)?.childrenTravelersCount ??
    request?.notes?.childrenAges?.length ??
    0
  const infantCount = (request?.notes as any)?.infantTravelersCount ?? 0

  const offerParams = useMemo(
    () =>
      enabled && tourId
        ? {
            tourId,
            adult: adultCount,
            child: childCount,
            infant: infantCount,
            roomType: request!.roomType ?? 0
          }
        : null,
    [enabled, tourId, adultCount, childCount, infantCount, request?.roomType]
  )

  const { data: offerPrice, isLoading: isLoadingOffer } =
    useGroupTourOfferPrice(offerParams)

  const packageDetails = useMemo((): PackageEntity | null => {
    if (!request || !offerPrice || !enabled) return null
    const groupTourData = groupTour as GroupTourInfo | undefined
    if (!groupTourData) return null

    const pkg = {
      ...groupTourData,
      travelAgency: {
        id: Number(groupTourData.agency?.id ?? request.travelAgencyId)
      } as any,
      checkin: request.startDate,
      checkout: request.endDate,
      price: offerPrice.price,
      currency: offerPrice.currency ?? request.currency,
      rate: offerPrice.rate ?? request.rate,
      roomType: request.roomType ?? 0,
      adultTravelers: adultCount,
      childrenTravelers: childCount,
      infantTravelers: infantCount,
      bookingType: 3
    }
    return pkg as unknown as PackageEntity
  }, [
    request,
    offerPrice,
    groupTour,
    enabled,
    adultCount,
    childCount,
    infantCount
  ])

  return {
    packageDetails,
    isLoading: isLoadingGroupTour || isLoadingOffer
  }
}
