import { useUserContext } from '@entities/user'
import {
  type PackageEntity,
  type RequestEntity,
  useBookPackage
} from '@entities/package'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { PaymentModalView } from '@widgets/PaymentModal'
import type { ITraveler } from '@/modules/packages/data/packagesTypes.ts'
import {
  CustomFields,
  PackagesFields
} from '@/modules/packages/data/packagesEnums.ts'
import { type Traveler } from '@widgets/TravelersModal/ui/types.ts'

export const useBookingFlow = ({
  currentOfferPackage,
  initialView,
  onClose,
  isOpen,
  childrenAges
}: useBookingFlowProps) => {
  const { user } = useUserContext()
  const { mutateAsync: bookPackageAsync } = useBookPackage()
  const requestIdRef = useRef<number | null>(null)
  const [modalView, setModalView] = useState('')
  const [paymentModalView, setPaymentModalView] =
    useState<PaymentModalView>('paymentForm')
  const [travelers, setTravelers] = useState<any>({ adults: [], children: [] })
  const travelersRef = useRef<ITraveler[]>([])

  useEffect(() => {}, [])

  useEffect(() => {
    travelersRef.current = travelers
  }, [travelers])

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
    console.log('closeModal')
    setPaymentModalView('paymentForm')
  }

  const onTravelersModalSuccess = (travelers: any) => {
    console.log('onTravelersModalSuccess : ', travelers)
    setTravelers(travelers)
    setModalView('payment')
  }

  const openPaymentModal = () => {
    setModalView('payment')
  }

  const onPaymentModalSuccess = useCallback(
    async (paymentAmount: number) => {
      console.log('onPaymentModalSuccess : ', {
        currentOfferPackage,
        travelers
      })

      if (!currentOfferPackage) {
        return
      }

      try {
        const bookInput = {
          [CustomFields.cityId]:
            currentOfferPackage[PackagesFields.city][PackagesFields.id],
          [PackagesFields.price]: currentOfferPackage[PackagesFields.price],
          [CustomFields.hotelId]:
            currentOfferPackage[PackagesFields.hotel][PackagesFields.id],
          [CustomFields.startDate]:
            currentOfferPackage[PackagesFields.destinationFlight][
              PackagesFields.departureDate
            ],
          [CustomFields.endDate]:
            currentOfferPackage[PackagesFields.returnFlight][
              PackagesFields.departureDate
            ],
          [CustomFields.travelAgencyId]:
            currentOfferPackage[PackagesFields.travelAgency][PackagesFields.id],
          [CustomFields.notes]: '',
          [PackagesFields.offerId]: currentOfferPackage[PackagesFields.offerId],
          [CustomFields.destinationFlightId]:
            currentOfferPackage[PackagesFields.destinationFlight][
              PackagesFields.id
            ],
          [CustomFields.returnFlightId]:
            currentOfferPackage[PackagesFields.returnFlight][PackagesFields.id],
          [PackagesFields.roomType]:
            currentOfferPackage[PackagesFields.roomType],
          [CustomFields.email]: user?.email || '',
          [CustomFields.phoneNumber]: user?.phoneNumber || '',
          [PackagesFields.amountToBePaid]: +paymentAmount,
          [PackagesFields.usdRate]: currentOfferPackage[PackagesFields.usdRate],
          [CustomFields.travelers]: [...travelers.adults, ...travelers.children]
        }
        await bookPackageAsync(bookInput)
      } catch (e) {
        setPaymentModalView('paymentError')
      }
    },
    [currentOfferPackage?.offerId, travelers]
  )

  useEffect(() => {
    if (user?.firstName && currentOfferPackage?.offerId) {
      setTravelers((prevState: any) => ({
        adults: [
          {
            firstName: user.firstName,
            lastName: user.lastName
          },
          ...Array(currentOfferPackage.adultTravelers - 1).fill({
            firstName: '',
            lastName: '',
            dateOfBirth: ''
          })
        ],
        children: Array(
          currentOfferPackage.childrenTravelers +
            currentOfferPackage.infantTravelers
        ).fill({
          firstName: '',
          lastName: '',
          dateOfBirth: ''
        })
      }))
    }
  }, [
    user?.id,
    currentOfferPackage?.adultTravelers,
    currentOfferPackage?.childrenTravelers,
    currentOfferPackage?.infantTravelers,
    isOpen
  ])

  // draft request sync

  const handleTravelersChange = useCallback(
    (data: Traveler[]) => {
      console.log('handleTravelersChange : ', data)

      return null
    },
    [requestIdRef.current, currentOfferPackage?.offerId, childrenAges]
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
  currentOfferPackage: PackageEntity | null
  initialView: 'travelers' | 'payment'
  onClose?: () => void
  isOpen?: boolean
  request?: RequestEntity
  childrenAges?: number[]
}
