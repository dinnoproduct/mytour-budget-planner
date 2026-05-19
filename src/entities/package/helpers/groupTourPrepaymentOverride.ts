import type { PrepaymentInfo } from '../api/types'
import { RequestStatus } from '../model/entities'
import moment from 'moment'

/**
 * TEMPORARY — remove this module’s usage (and delete or empty the set) once the
 * backend returns correct partial prepayment for these tours.
 *
 * Group tours whose prepayment API returns full-pay-only but must still offer
 * partial payment (minimum 50%) in the UI until then.
 */
const GROUP_TOUR_IDS_FORCE_PARTIAL_PREPAYMENT = new Set<string>([
  'f640cb08-54d6-45da-a129-4c31fbd57904',
  '3213e320-0ef1-4752-9cf9-98f4e619b7dc'
])

/**
 * TEMPORARY — same ids as prepayment workaround.
 * Also: My Packages visibility + book `price` alignment (see
 * {@link isSpecialGroupTourRequestVisibleInMyPackages}).
 */
export function isGroupTourSpecialBookingId(
  tourId: string | null | undefined,
): boolean {
  return !!tourId && GROUP_TOUR_IDS_FORCE_PARTIAL_PREPAYMENT.has(tourId)
}

/**
 * TEMPORARY — My Packages: for special tour ids only, show the request when
 * status is Booked (4), Purchased (5), overdue Draft (UI maps to 10), or raw 10.
 * All other statuses stay hidden so the list is not cluttered by these tours.
 */
export function isSpecialGroupTourRequestVisibleInMyPackages(request: {
  groupTourId?: string
  status: number
  startDate: string
}): boolean {
  if (!isGroupTourSpecialBookingId(request.groupTourId)) {
    return true
  }
  if (request.status === RequestStatus.Booked) return true
  if (request.status === RequestStatus.Purchased) return true
  if (request.status === 10) return true
  if (request.status !== RequestStatus.Draft) {
    return false
  }
  return moment(request.startDate).isBefore(moment())
}

export type GroupTourPackageLike = {
  groupTourId?: string
  id?: number | string
  bookingType?: number
} | null

/**
 * Resolves the stable UUID for a group-tour-shaped package (booking flow uses
 * {@link GroupTourInfo.id}; requests may carry {@link groupTourId}).
 */
export function resolveGroupTourPackageTourId(
  packageDetails: GroupTourPackageLike | undefined,
): string | undefined {
  if (!packageDetails) return undefined
  if (typeof packageDetails.groupTourId === 'string') {
    return packageDetails.groupTourId
  }
  if (
    packageDetails.bookingType === 3 &&
    typeof packageDetails.id === 'string'
  ) {
    return packageDetails.id
  }
  return undefined
}

/**
 * Do not override prepayment when paying an outstanding balance or any
 * installment after money has already been recorded on the request — use API
 * rules only. Ensures second / remaining payments for TEMP tour ids follow
 * backend prepayment rules.
 */
export function shouldSkipGroupTourForcedPartialPrepaymentOverride(params: {
  /** e.g. PaymentPage when `mode === "remainingOnly"` */
  isRemainingBalancePayment?: boolean
  /** Amount already paid on this booking (request.prePaymentAmount). */
  paidTowardRequest?: number | null
}): boolean {
  if (params.isRemainingBalancePayment) return true
  if ((params.paidTowardRequest ?? 0) > 0) return true
  return false
}

/**
 * TEMPORARY — delete when backend prepayment rules cover these tours.
 *
 * When backend returns {@link FullPricePayment} for a forced partial tour,
 * expose partial prepayment with at least 50% of {@link PrepaymentInfo.fullPrice}.
 */
export function withGroupTourForcedPartialPrepayment(
  prepaymentInfo: PrepaymentInfo | null,
  tourId: string | undefined,
): PrepaymentInfo | null {
  if (
    !prepaymentInfo ||
    !tourId ||
    !GROUP_TOUR_IDS_FORCE_PARTIAL_PREPAYMENT.has(tourId)
  ) {
    return prepaymentInfo
  }
  if (prepaymentInfo.paymentType !== 'FullPricePayment') {
    return prepaymentInfo
  }
  const fullPrice = prepaymentInfo.fullPrice
  const minimumAcceptablePayment = Math.ceil(fullPrice * 0.5)
  return {
    ...prepaymentInfo,
    paymentType: 'PartialPricePayment',
    minimumAcceptablePayment,
    minimumAcceptablePaymentPercentage: 50,
  }
}
