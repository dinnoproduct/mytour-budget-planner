import { useUserContext } from '@entities/user'
import {
  type PackageEntity,
  type PaymentSystem,
  useBookPackage,
  useCreateRequest,
  useReservePackage,
  useUpdateRequest,
  type NormalizedRequestEntity,
  useCalculatePrepayment,
  RequestStatus,
  useValidatePromoCode,
  resolveGroupTourPackageTourId,
  shouldSkipGroupTourForcedPartialPrepaymentOverride,
  withGroupTourForcedPartialPrepayment,
} from '@entities/package'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { PaymentModalView, PaymentOption } from '../ui/PaymentModal/types.ts'
import { isMobile } from 'react-device-detect'

import { type Travelers } from '@widgets/TravelersModal/ui/types.ts'
import { useTranslation } from 'react-i18next'
import { LANGUAGE_NAME_MAP, type LanguageName } from '@shared/model'
import { useLanguageNavigate } from '@/hooks/useLanguageNavigate'

export const useBookingFlow = ({
  packageDetails,
  initialView,
  onClose,
  isOpen,
  request: initialRequest,
  childrenAges,
  defaultTravelers,
  isLateCheckout,
  renderAsPage = false
}: useBookingFlowProps) => {
  const { user } = useUserContext()
  const { i18n } = useTranslation()
  const { navigateToBookingResult } = useLanguageNavigate()
  const { mutateAsync: createRequestAsync } = useCreateRequest()
  const { mutateAsync: updateRequestAsync } = useUpdateRequest()
  const { mutateAsync: bookPackageAsync } = useBookPackage()
  const { mutateAsync: reservePackageAsync } = useReservePackage()
  const validatePromoCode = useValidatePromoCode()
  const isRequestInProgressRef = useRef(false)
  const [isLoadingBooking, setIsLoadingBooking] = useState(false)
  const [isLoadingTravelersModal, setIsLoadingTravelersModal] = useState(false)
  const [request, setRequest] = useState<NormalizedRequestEntity | null>(
    initialRequest || null
  )
  const requestIdRef = useRef(initialRequest?.id ? initialRequest.id : null)
  const [modalView, setModalView] = useState('')
  const [paymentModalView, setPaymentModalView] =
    useState<PaymentModalView>('paymentForm')
  const [travelers, setTravelers] = useState<Travelers>({
    adults: [],
    children: []
  })
  const notesJson = useRef<any>('')
  const [promoDiscountedPrice, setPromoDiscountedPrice] = useState<number | null>(null)

  useEffect(() => {
    setRequest(initialRequest || null)
    requestIdRef.current = initialRequest?.id || null
  }, [initialRequest])

  useEffect(() => {
    if (!isOpen) return
    if (renderAsPage && !user?.id) {
      setModalView('auth')
    } else {
      setModalView(initialView)
    }
  }, [initialView, isOpen, renderAsPage, user?.id])

  const openTravelersModal = () => {
    setModalView('travelers')
  }

  const onAuthSuccess = () => {
    setModalView('travelers')
  }

  const closeModal = () => {
    setModalView('')
    onClose && onClose()
    setTravelers({ adults: [], children: [] })
    setRequest(null)
    requestIdRef.current = null
    setPaymentModalView('paymentForm')
  }

  const openPaymentModal = () => {
    setModalView('payment')
  }

  const onPaymentModalSuccess = useCallback(
    async (
      paymentAmount: number,
      paymentSystem: PaymentSystem,
      paymentOption: PaymentOption,
      promoCodeInfo?: {
        promoCode: string
        initialPrice: number
        firstPaymentSum: number
      }
    ): Promise<string | undefined> => {
      if (!packageDetails || !request?.id) {
        return undefined
      }

      setIsLoadingBooking(true)

      try {
        const amountToBePaid = promoCodeInfo
          ? promoCodeInfo.firstPaymentSum
          : paymentAmount;

        const isGroupTour =
          (packageDetails as any)?.bookingType === 3 ||
          (!(packageDetails as any).hotel &&
            (packageDetails as any).departures &&
            (packageDetails as any).agency)

        const baseBookInput: any = {
          requestId: request.id,
          price: promoCodeInfo?.initialPrice ?? packageDetails.price,
          travelAgencyId: packageDetails.travelAgency?.id ?? 0,
          email: user?.email || '',
          notes: notesJson.current
            ? notesJson.current
            : JSON.stringify(request.notes),
          phoneNumber: user?.phoneNumber || '',
          amountToBePaid: +amountToBePaid,
          usdRate: packageDetails.usdRate,
          currency: packageDetails.currency,
          rate: packageDetails.rate,
          travelers: [...travelers.adults, ...travelers.children],
          paymentSystem
        }

        const bookInput: any = isGroupTour
          ? {
            ...baseBookInput,
            groupTourId: (packageDetails as any).id,
            cityId: 0,
            hotelId: 0,
            offerId: 0,
            roomType: (packageDetails as any).roomType ?? 0,
            startDate: (packageDetails as any).checkin,
            endDate: (packageDetails as any).checkout,
            destinationFlightId: 0,
            returnFlightId: 0
          }
          : {
            ...baseBookInput,
            cityId: packageDetails.city?.id ?? 0,
            hotelId: packageDetails.hotel?.id ?? 0,
            offerId: packageDetails.offerId,
            roomType: packageDetails.roomType,
            destinationFlightId: packageDetails.destinationFlight?.id ?? 0,
            returnFlightId: packageDetails.returnFlight?.id ?? 0,
            startDate: packageDetails.destinationFlight?.departureDate
              ? packageDetails.destinationFlight.departureDate
              : packageDetails.checkin,
            endDate: packageDetails.destinationFlight?.departureDate
              ? packageDetails.returnFlight.departureDate
              : packageDetails.checkout
          }

        if (promoCodeInfo?.promoCode) {
          bookInput.promoCode = promoCodeInfo.promoCode
        }

        if (packageDetails.destinationFlight?.departureDate) {
          bookInput.startDate = packageDetails.destinationFlight.departureDate
          bookInput.endDate = packageDetails.returnFlight.departureDate
          bookInput.destinationFlightId = packageDetails.destinationFlight.id
          bookInput.returnFlightId = packageDetails.returnFlight.id
          bookInput.bookingType = 1
        } else {
          bookInput.startDate = packageDetails.checkin
          bookInput.endDate = packageDetails.checkout
          bookInput.bookingType = 2
          bookInput.foodType = packageDetails.foodType || 0
        }

        if (paymentOption === 'noPrepayment') {
          await reservePackageAsync(bookInput)
          setIsLoadingBooking(false)
          if (renderAsPage) {
            navigateToBookingResult({ success: true, replace: true })
          } else {
            setPaymentModalView('paymentSuccess')
          }
          return
        }

        sessionStorage.setItem('isPaymentRedirect', '1')
        const bookResponse = await bookPackageAsync(bookInput)
        setIsLoadingBooking(false)

        if (!bookResponse.success) {
          if (renderAsPage) {
            navigateToBookingResult({ error: true, replace: true })
          } else {
            setPaymentModalView('paymentError')
          }
          return
        }

        if (!bookResponse.bookingPaymentUrl) {
          if (renderAsPage) {
            navigateToBookingResult({ success: true, replace: true })
          } else {
            setPaymentModalView('paymentSuccess')
          }
          return
        }

        try {
          localStorage.setItem('bookingResultSource', 'booking')
        } catch {
          // ignore
        }
        if (bookResponse.bookingPaymentUrl === "amount_is_zero") {
          navigateToBookingResult({ success: true, replace: true, fromPayment: false })
          return
        }

        if (paymentSystem === ('VPos' as PaymentSystem.VPos)) {
          window.location.href =
            bookResponse.bookingPaymentUrl +
            `&lang=${LANGUAGE_NAME_MAP[i18n.language as LanguageName]}`

          return
        } else if (
          paymentSystem === ('MyAmeriaPay' as PaymentSystem.MyAmeriaPay)
        ) {
          window.location.href = bookResponse.bookingPaymentUrl
        } else if (
          paymentSystem === ('IDram' as PaymentSystem.IDram)
        ) {
          window.location.href = bookResponse.bookingPaymentUrl
        }
      } catch (e) {
        if (renderAsPage) {
          navigateToBookingResult({ error: true, replace: true })
        } else {
          setPaymentModalView('paymentError')
        }
      }
    },
    [request, packageDetails?.offerId, travelers, renderAsPage, navigateToBookingResult]
  )

  useEffect(() => {
    if (!packageDetails) {
      return
    }

    if (defaultTravelers) {
      const merged: Travelers = {
        ...defaultTravelers,
        adults:
          defaultTravelers.adults.length > 0 && user?.firstName
            ? defaultTravelers.adults.map((adult, i) =>
              i === 0
                ? { ...adult, firstName: user.firstName, lastName: user.lastName }
                : adult
            )
            : defaultTravelers.adults
      }
      setTravelers(merged)
    } else if (!isGroupTourPackage && packageDetails.offerId && user?.firstName) {
      setTravelers((prevState: any) => ({
        adults: [
          {
            firstName: user.firstName,
            lastName: user.lastName
          },
          ...Array(packageDetails.adultTravelers - 1).fill({
            firstName: '',
            lastName: '',
            dateOfBirth: ''
          })
        ],
        children: Array(
          packageDetails.childrenTravelers + packageDetails.infantTravelers
        ).fill({
          firstName: '',
          lastName: '',
          dateOfBirth: ''
        })
      }))
    }
  }, [
    user?.id,
    user?.firstName,
    user?.lastName,
    packageDetails?.adultTravelers,
    packageDetails?.childrenTravelers,
    packageDetails?.infantTravelers,
    isOpen,
    defaultTravelers
  ])

  const onTravelersModalSuccess = (travelers: Travelers) => {
    setTravelers(travelers)
    setIsLoadingTravelersModal(true)
  }

  useEffect(() => {
    const handleTravelersModalTransition = () => {
      if (
        isLoadingTravelersModal &&
        !isRequestInProgressRef.current &&
        requestIdRef.current
      ) {
        setModalView('payment')
        setIsLoadingTravelersModal(false)
      }
    }

    handleTravelersModalTransition()
  }, [
    isLoadingTravelersModal,
    isRequestInProgressRef.current,
    requestIdRef.current
  ])

  // draft request sync
  const handleTravelersChange = useCallback(
    async (data: Travelers) => {
      if (!packageDetails) return

      const isGroupTour =
        (packageDetails as any)?.bookingType === 3 ||
        (!(packageDetails as any).hotel &&
          (packageDetails as any).departures &&
          (packageDetails as any).agency)

      const childrenCount = isGroupTour
        ? (packageDetails as any).childrenTravelers ?? 0
        : packageDetails.childrenTravelers
      const infantCount = isGroupTour
        ? (packageDetails as any).infantTravelers ?? 0
        : packageDetails.infantTravelers

      const notes = {
        childrenAges: childrenAges || [],
        totalTravelersCount: isGroupTour
          ? data.adults.length + data.children.length
          : packageDetails.adultTravelers +
          packageDetails.childrenTravelers +
          packageDetails.infantTravelers,
        adultTravelersCount: isGroupTour
          ? data.adults.length
          : packageDetails.adultTravelers,
        childrenTravelersCount: isGroupTour ? childrenCount : undefined,
        infantTravelersCount: isGroupTour ? infantCount : undefined,
        travelers: data,
        isSoldOut: false
      } as any

      if (typeof isLateCheckout === 'boolean') {
        notes.isLateCheckout = isLateCheckout
      }

      const newNotesJson = JSON.stringify(notes)
      notesJson.current = newNotesJson

      if (isRequestInProgressRef.current) {
        return
      }

      const requestInput: any = isGroupTour
        ? {
          groupTourId: (packageDetails as any).id,
          offerId: 0,
          travelers: [...data.adults, ...data.children],
          cityId: 0,
          hotelId: 0,
          price: packageDetails.price,
          roomType: (packageDetails as any).roomType ?? 0,
          travelAgencyId: packageDetails.travelAgency?.id ?? 0,
          notes: newNotesJson,
          currency: packageDetails.currency,
          rate: packageDetails.rate,
          startDate: (packageDetails as any).checkin,
          endDate: (packageDetails as any).checkout,
          destinationFlightId: 0,
          returnFlightId: 0
        }
        : {
          offerId: packageDetails.offerId,
          travelers: [...data.adults, ...data.children],
          cityId: packageDetails.city.id,
          hotelId: packageDetails.hotel.id,
          price: packageDetails.price,
          roomType: packageDetails.roomType,
          travelAgencyId: packageDetails.travelAgency.id,
          foodType: packageDetails.foodType,
          notes: newNotesJson,
          currency: packageDetails.currency,
          rate: packageDetails.rate,
          startDate: packageDetails.destinationFlight?.departureDate
            ? packageDetails.destinationFlight.departureDate
            : packageDetails.checkin,
          endDate: packageDetails.destinationFlight?.departureDate
            ? packageDetails.returnFlight.departureDate
            : packageDetails.checkout,
          destinationFlightId: packageDetails.destinationFlight?.id,
          returnFlightId: packageDetails.returnFlight?.id
        }

      isRequestInProgressRef.current = true

      try {
        if (!requestIdRef.current) {
          const newRequestId = await createRequestAsync({
            ...requestInput
          })
          setRequest({
            id: newRequestId,
            ...requestInput
          } as NormalizedRequestEntity)

          requestIdRef.current = newRequestId
        } else {
          const success = await updateRequestAsync({
            id: requestIdRef.current,
            ...requestInput
          })

          if (success) {
            setRequest({
              ...request,
              ...requestInput
            } as NormalizedRequestEntity)
          }
        }
      } finally {
        isRequestInProgressRef.current = false
      }
    },
    [request?.id, requestIdRef.current, packageDetails, childrenAges]
  )

  // calculate prepayment
  const isHotelPackage = useMemo(
    () => !!(packageDetails && !packageDetails.destinationFlight?.id),
    [packageDetails]
  )
  const isGroupTourPackage = useMemo(
    () =>
      !!packageDetails &&
      !(packageDetails as any).hotel &&
      (packageDetails as any).departures &&
      (packageDetails as any).agency,
    [packageDetails]
  )
  const isDraftRequest = useMemo(
    () =>
      !initialRequest ||
      [RequestStatus.Draft, RequestStatus.NotPaid, 10].includes(
        initialRequest?.status || 0
      ),
    [initialRequest]
  )

  // If backend or previous step stored a discounted full price in request notes,
  // prefer that for prepayment calculation; otherwise fall back to package price.
  const discountedFullPrice =
    (initialRequest?.notes as any)?.discountedFullPrice ??
    packageDetails?.price ??
    0

  const effectiveFullPrice = promoDiscountedPrice ?? discountedFullPrice

  const { data: prepaymentInfoFromApi = null } = useCalculatePrepayment(
    {
      travelAgencyId: packageDetails?.travelAgency?.id ?? 0,
      bookingType: initialRequest?.bookingType
        ? initialRequest.bookingType
        : isGroupTourPackage
          ? 3
          : isHotelPackage
            ? 2
            : 1,
      destinationId: packageDetails?.city?.id ?? 0,
      startDate: (packageDetails as any)?.checkin ?? '',
      fullPrice: effectiveFullPrice,
      calculationSource: isDraftRequest ? 'search' : 'myBookings'
    },
    {
      enabled: !!packageDetails && isOpen
    }
  )

  const paidTowardRequest = Math.max(
    initialRequest?.prePaymentAmount ?? 0,
    request?.prePaymentAmount ?? 0,
  )
  const skipGroupTourPrepaymentHotfix =
    shouldSkipGroupTourForcedPartialPrepaymentOverride({
      paidTowardRequest,
    })

  const prepaymentInfo = useMemo(() => {
    if (skipGroupTourPrepaymentHotfix) {
      return prepaymentInfoFromApi
    }
    const tourId = resolveGroupTourPackageTourId(packageDetails ?? null)
    return withGroupTourForcedPartialPrepayment(
      prepaymentInfoFromApi,
      tourId,
    )
  }, [
    packageDetails,
    prepaymentInfoFromApi,
    skipGroupTourPrepaymentHotfix,
  ])

  return {
    openTravelersModal,
    onAuthSuccess,
    onTravelersModalSuccess,
    openPaymentModal,
    onPaymentModalSuccess,
    paymentModalView,
    isLoadingBooking,
    isLoadingTravelersModal,
    travelers,
    modalView,
    closeModal,
    handleTravelersChange,
    prepaymentInfo,
    validatePromoCode,
    setPromoDiscountedPrice
  }
}

type useBookingFlowProps = {
  packageDetails?: PackageEntity | null
  initialView: 'travelers' | 'payment'
  onClose?: () => void
  isOpen?: boolean
  request?: NormalizedRequestEntity | null
  childrenAges?: number[]
  defaultTravelers?: Travelers
  isLateCheckout?: boolean
  renderAsPage?: boolean
}
