import type { PrepaymentInfo } from '../api/types'

/**
 * TEMPORARY — remove this module’s usage (and delete or empty the set) once the
 * backend returns correct partial prepayment for these tours.
 *
 * Group tours whose prepayment API returns full-pay-only but must still offer
 * partial payment (minimum 50%) in the UI until then.
 */
const GROUP_TOUR_IDS_FORCE_PARTIAL_PREPAYMENT = new Set<string>([
  'f640cb08-54d6-45da-a129-4c31fbd57904',
])

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
 * rules only.
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
