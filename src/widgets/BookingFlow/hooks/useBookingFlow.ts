import { useUserContext } from '@entities/user'
import {
  type PackageEntity,
  useBookPackage,
  useCreateRequest,
  useUpdateRequest
} from '@entities/package'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { PaymentModalView } from '@widgets/PaymentModal'

import { type Travelers } from '@widgets/TravelersModal/ui/types.ts'

export const useBookingFlow = ({
  packageDetails,
  initialView,
  onClose,
  isOpen,
  requestId,
  childrenAges,
  defaultTravelers
}: useBookingFlowProps) => {
  const { user } = useUserContext()
  const { mutateAsync: createRequestAsync } = useCreateRequest()
  const { mutateAsync: updateRequestAsync } = useUpdateRequest()
  const { mutateAsync: bookPackageAsync } = useBookPackage()
  const requestIdRef = useRef<number | null>(null)
  const [modalView, setModalView] = useState('')
  const [paymentModalView, setPaymentModalView] =
    useState<PaymentModalView>('paymentForm')
  const [travelers, setTravelers] = useState<any>({ adults: [], children: [] })
  // const travelersRef = useRef<ITraveler[]>([])
  //
  useEffect(() => {
    if (requestId) {
      requestIdRef.current = requestId
    }
  }, [requestId])

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
    async (paymentAmount: number) => {
      if (!packageDetails || !requestIdRef.current) {
        return
      }

      try {
        const bookInput = {
          requestId: requestIdRef.current,
          cityId: packageDetails.city.id,
          price: packageDetails.price,
          hotelId: packageDetails.hotel.id,
          startDate: packageDetails.destinationFlight.departureDate,
          endDate: packageDetails.returnFlight.departureDate,
          travelAgencyId: packageDetails.travelAgency.id,
          offerId: packageDetails.offerId,
          destinationFlightId: packageDetails.destinationFlight.id,
          returnFlightId: packageDetails.returnFlight.id,
          roomType: packageDetails.roomType,
          email: user?.email || '',
          phoneNumber: user?.phoneNumber || '',
          amountToBePaid: +paymentAmount,
          usdRate: packageDetails.usdRate,
          travelers: [...travelers.adults, ...travelers.children]
        }
        await bookPackageAsync(bookInput)
      } catch (e) {
        setPaymentModalView('paymentError')
      }
    },
    [requestIdRef.current, packageDetails?.offerId, travelers]
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
      if (!packageDetails?.offerId) {
        return
      }

      const notesJson = JSON.stringify({
        childrenAges: childrenAges || [],
        totalTravelersCount:
          packageDetails.adultTravelers +
          packageDetails.childrenTravelers +
          packageDetails.infantTravelers,
        adultTravelersCount: packageDetails.adultTravelers,
        travelers: data,
        isSoldOut: false
      })

      const requestInput = {
        offerId: packageDetails.offerId,
        travelers: [...data.adults, ...data.children],
        cityId: packageDetails.city.id,
        hotelId: packageDetails.hotel.id,
        price: packageDetails.price,
        roomType: packageDetails.roomType,
        travelAgencyId: packageDetails.travelAgency.id,
        startDate: packageDetails.destinationFlight.departureDate,
        endDate: packageDetails.returnFlight.departureDate,
        destinationFlightId: packageDetails.destinationFlight.id,
        returnFlightId: packageDetails.returnFlight.id,
        notes: notesJson
      }

      if (!requestIdRef.current) {
        const newRequestId = await createRequestAsync({
          ...requestInput
        })
        requestIdRef.current = newRequestId

        return
      }

      const res = await updateRequestAsync({
        id: requestIdRef.current,
        ...requestInput
      })
    },
    [requestIdRef.current, packageDetails?.offerId, childrenAges]
  )

  return {
    openTravelersModal,
    onTravelersModalSuccess,
    openPaymentModal,
    onPaymentModalSuccess,
    paymentModalView,
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
  requestId?: number
  childrenAges?: number[]
  defaultTravelers?: Travelers
}
