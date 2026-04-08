import { useState } from 'react'
import type { TFunction } from 'i18next'
import type { RequestCardProps } from '@widgets/UserPackages/ui/RequestCard/types.ts'
import { useValidatePromoCode } from '@entities/package'

export const useRequestPromoCode = (
  request: RequestCardProps['request'],
  t: TFunction,
) => {
  const validatePromoCode = useValidatePromoCode()

  const [hasPromoCode, setHasPromoCode] = useState(false)
  const [promoCode, setPromoCode] = useState<string>('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [discountedRemainingAmount, setDiscountedRemainingAmount] =
    useState<number | null>(null)
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false)

  const resetPromo = () => {
    setHasPromoCode(false)
    setPromoApplied(false)
    setPromoCode('')
    setPromoError(null)
    setDiscountedRemainingAmount(null)
  }

  const handleApply = () => {
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
        prePaymentAmount: request.prePaymentAmount,
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
        },
      },
    )
  }

  const handleSwitchToggle = () => {
    if (!hasPromoCode) {
      setHasPromoCode(true)
      setIsPromoModalOpen(true)
    } else {
      resetPromo()
    }
  }

  const handleModalClose = () => {
    setIsPromoModalOpen(false)
    if (!promoApplied) {
      resetPromo()
    }
  }

  const effectiveRemainingAmount =
    promoApplied && discountedRemainingAmount !== null
      ? discountedRemainingAmount
      : request.remainingPaymentAmount

  return {
    hasPromoCode,
    promoCode,
    promoApplied,
    promoError,
    isPromoModalOpen,
    isApplying: validatePromoCode.isPending,
    discountedRemainingAmount,
    effectiveRemainingAmount,
    setPromoCode,
    setPromoError,
    setIsPromoModalOpen,
    handleApply,
    handleSwitchToggle,
    handleModalClose,
  }
}
