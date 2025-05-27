import { useUserContext } from '@entities/user'
import {
  type PackageEntity,
  type PaymentSystem,
  useBookPackage,
  useCreateRequest,
  useReservePackage,
  useUpdateRequest,
  type NormalizedRequestEntity
} from '@entities/package'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { PaymentModalView } from '../ui/PaymentModal/types.ts'
import { isMobile } from 'react-device-detect'

import { type Travelers } from '@widgets/TravelersModal/ui/types.ts'
import { useTranslation } from 'react-i18next'
import { LANGUAGE_NAME_MAP, type LanguageName } from '@shared/model'

export const useBookingFlow = ({
  packageDetails,
  initialView,
  onClose,
  isOpen,
  request: initialRequest,
  childrenAges,
  defaultTravelers,
  isLateCheckout
}: useBookingFlowProps) => {
  const { user } = useUserContext()
  const { i18n } = useTranslation()
  const { mutateAsync: createRequestAsync, isPending: isPendingCreateRequest } =
    useCreateRequest()
  const { mutateAsync: updateRequestAsync, isPending: isPendingUpdateRequest } =
    useUpdateRequest()
  const { mutateAsync: bookPackageAsync } = useBookPackage()
  const { mutateAsync: reservePackageAsync } = useReservePackage()
  const [isLoadingBooking, setIsLoadingBooking] = useState(false)
  const [request, setRequest] = useState<NormalizedRequestEntity | null>(
    initialRequest || null
  )
  const requestIdRef = useRef(initialRequest?.id ? initialRequest.id : null)
  const [modalView, setModalView] = useState('')
  const [paymentModalView, setPaymentModalView] =
    useState<PaymentModalView>('paymentForm')
  const [travelers, setTravelers] = useState<any>({ adults: [], children: [] })
  const [notesJson, setNotesJson] = useState<any>('')

  useEffect(() => {
    setRequest(initialRequest || null)
    requestIdRef.current = initialRequest?.id || null
  }, [initialRequest])

  useEffect(() => {
    setModalView(initialView)
  }, [initialView, isOpen])

  const openTravelersModal = () => {
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

  const onTravelersModalSuccess = (travelers: Travelers) => {
    setTravelers(travelers)
    setModalView('payment')
  }

  const openPaymentModal = () => {
    setModalView('payment')
  }

  const onPaymentModalSuccess = useCallback(
    async (paymentAmount: number, paymentSystem: PaymentSystem) => {
      if (!packageDetails || !request?.id) {
        return
      }

      setIsLoadingBooking(true)

      try {
        const bookInput: any = {
          requestId: request.id,
          cityId: packageDetails.city.id,
          price: packageDetails.price,
          hotelId: packageDetails.hotel.id,
          travelAgencyId: packageDetails.travelAgency.id,
          offerId: packageDetails.offerId,
          roomType: packageDetails.roomType,
          email: user?.email || '',
          notes: notesJson ? notesJson : JSON.stringify(request.notes),
          phoneNumber: user?.phoneNumber || '',
          amountToBePaid: +paymentAmount,
          usdRate: packageDetails.usdRate,
          travelers: [...travelers.adults, ...travelers.children],
          paymentSystem
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
          bookInput.footType = packageDetails.foodType || 0
        }

        if (paymentAmount === 0) {
          const reserveResponse = await reservePackageAsync(bookInput)
          setIsLoadingBooking(false)
          setModalView('success')

          return
        }

        const bookResponse = await bookPackageAsync(bookInput)
        setIsLoadingBooking(false)

        if (paymentSystem === ('VPos' as PaymentSystem.VPos)) {
          window.location.href =
            bookResponse.bookingPaymentUrl +
            `&lang=${LANGUAGE_NAME_MAP[i18n.language as LanguageName]}`

          return
        } else if (
          paymentSystem === ('MyAmeriaPay' as PaymentSystem.MyAmeriaPay)
        ) {
          if (isMobile) {
            window.location.href = bookResponse.bookingPaymentUrl

            return
          }

          return bookResponse.bookingPaymentUrl
        }
      } catch (e) {
        setPaymentModalView('paymentError')
      }
    },
    [request, packageDetails?.offerId, travelers]
  )

  useEffect(() => {
    if (!packageDetails?.offerId) {
      return
    }

    if (defaultTravelers) {
      const filledTravelers = {
        adults: [
          ...defaultTravelers.adults,
          ...Array(
            packageDetails.adultTravelers -
              (defaultTravelers.adults.length || 0)
          ).fill({
            firstName: '',
            lastName: '',
            dateOfBirth: ''
          })
        ],
        children: [
          ...defaultTravelers.children,
          ...Array(
            packageDetails?.childrenTravelers +
              packageDetails?.infantTravelers -
              (defaultTravelers.children.length || 0)
          ).fill({
            firstName: '',
            lastName: '',
            dateOfBirth: ''
          })
        ]
      }

      setTravelers(filledTravelers)
    } else if (user?.firstName) {
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
    packageDetails?.adultTravelers,
    packageDetails?.childrenTravelers,
    packageDetails?.infantTravelers,
    isOpen,
    defaultTravelers
  ])

  // draft request sync

  const handleTravelersChange = useCallback(
    async (data: Travelers) => {
      if (
        !packageDetails?.offerId ||
        isPendingCreateRequest ||
        isPendingUpdateRequest
      ) {
        return
      }

      const notes = {
        childrenAges: childrenAges || [],
        totalTravelersCount:
          packageDetails.adultTravelers +
          packageDetails.childrenTravelers +
          packageDetails.infantTravelers,
        adultTravelersCount: packageDetails.adultTravelers,
        travelers: data,
        isSoldOut: false
      } as any

      if (typeof isLateCheckout === 'boolean') {
        notes.isLateCheckout = isLateCheckout
      }

      const notesJson = JSON.stringify(notes)
      setNotesJson(notesJson)

      const requestInput: any = {
        offerId: packageDetails.offerId,
        travelers: [...data.adults, ...data.children],
        cityId: packageDetails.city.id,
        hotelId: packageDetails.hotel.id,
        price: packageDetails.price,
        roomType: packageDetails.roomType,
        travelAgencyId: packageDetails.travelAgency.id,
        // startDate: packageDetails.destinationFlight.departureDate,
        // endDate: packageDetails.returnFlight.departureDate,
        // destinationFlightId: packageDetails.destinationFlight.id,
        // returnFlightId: packageDetails.returnFlight.id,
        notes: notesJson
      }

      if (packageDetails.destinationFlight?.departureDate) {
        requestInput.startDate = packageDetails.destinationFlight.departureDate
        requestInput.endDate = packageDetails.returnFlight.departureDate
        requestInput.destinationFlightId = packageDetails.destinationFlight.id
        requestInput.returnFlightId = packageDetails.returnFlight.id
      } else {
        requestInput.startDate = packageDetails.checkin
        requestInput.endDate = packageDetails.checkout
      }

      if (!requestIdRef.current) {
        const newRequestId = await createRequestAsync({
          ...requestInput
        })
        setRequest({
          id: newRequestId,
          ...requestInput
        } as NormalizedRequestEntity)

        requestIdRef.current = newRequestId

        return
      }

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
    },
    [
      request?.id,
      requestIdRef.current,
      packageDetails?.offerId,
      childrenAges,
      isPendingCreateRequest,
      isPendingUpdateRequest
    ]
  )

  return {
    openTravelersModal,
    onTravelersModalSuccess,
    openPaymentModal,
    onPaymentModalSuccess,
    paymentModalView,
    isLoadingBooking,
    travelers,
    modalView,
    closeModal,
    handleTravelersChange
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
}
