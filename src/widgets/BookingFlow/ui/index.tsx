import { PaymentModal } from '@widgets/PaymentModal'
import { TravelersModal } from '@widgets/TravelersModal'
import type { BookingFlowProps } from '@widgets/BookingFlow/ui/types.ts'
import { useBookingFlow } from '../hooks'

export const BookingFlow = ({
  packageDetails,
  initialView,
  childrenAges,
  requestId,
  isOpen,
  onClose,
  defaultTravelers
}: BookingFlowProps) => {
  const {
    paymentModalView,
    onTravelersModalSuccess,
    onPaymentModalSuccess,
    openTravelersModal,
    travelers,
    modalView,
    closeModal,
    handleTravelersChange
  } = useBookingFlow({
    initialView,
    packageDetails,
    onClose,
    isOpen,
    childrenAges,
    requestId,
    defaultTravelers
  })
  console.log('booking flow packageDetails : ', packageDetails)

  if (!packageDetails?.offerId || !isOpen) {
    return null
  }

  return (
    <>
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
        />
      )}

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
    </>
  )
}
