import { PaymentModal } from './PaymentModal'
import { TravelersModal } from '@widgets/TravelersModal'
import type { BookingFlowProps } from '@widgets/BookingFlow/ui/types.ts'
import { useBookingFlow } from '../hooks'
import { PaymentSuccessModal } from '@entities/package'

export const BookingFlow = ({
  packageDetails,
  initialView,
  childrenAges,
  request,
  isOpen,
  onClose,
  defaultTravelers,
  isLateCheckout,
  isBooked
}: BookingFlowProps) => {
  const {
    paymentModalView,
    onTravelersModalSuccess,
    onPaymentModalSuccess,
    openTravelersModal,
    travelers,
    modalView,
    closeModal,
    handleTravelersChange,
    isLoadingBooking
  } = useBookingFlow({
    initialView,
    packageDetails,
    onClose,
    isOpen,
    childrenAges,
    request,
    defaultTravelers,
    isLateCheckout
  })

  if (!packageDetails?.offerId || !isOpen) {
    return null
  }

  return (
    <>
      {modalView === 'travelers' && (
        <TravelersModal
          isOpen={true}
          closeModal={() => closeModal()}
          packageDetails={packageDetails}
          travelers={travelers}
          onSuccess={onTravelersModalSuccess}
          onChange={handleTravelersChange}
        />
      )}

      {modalView === 'payment' && (
        <PaymentModal
          isOpen={true}
          closeModal={() => closeModal()}
          packageDetails={packageDetails}
          onSuccess={onPaymentModalSuccess}
          view={paymentModalView}
          onBackClick={
            initialView === 'payment' ? undefined : openTravelersModal
          }
          isLoadingBooking={isLoadingBooking}
          isBooked={isBooked}
        />
      )}

      {modalView === 'success' && (
        <PaymentSuccessModal closeModal={() => closeModal()} />
      )}
    </>
  )
}
