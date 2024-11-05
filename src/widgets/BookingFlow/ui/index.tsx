import { PaymentModal } from '@widgets/PaymentModal'
import { TravelersModal } from '@widgets/TravelersModal'
import type { BookingFlowProps } from '@widgets/BookingFlow/ui/types.ts'
import { useBookingFlow } from '../hooks'

export const BookingFlow = ({
  currentOfferPackage,
  initialView,
  childrenAges,
  isOpen,
  onClose
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
    currentOfferPackage,
    onClose,
    isOpen,
    childrenAges
  })

  return (
    <>
      {modalView === 'payment' && isOpen && (
        <PaymentModal
          isOpen={true}
          closeModal={() => closeModal()}
          packageDetails={currentOfferPackage}
          onSuccess={onPaymentModalSuccess}
          view={paymentModalView}
          onBackClick={() => {
            openTravelersModal()
          }}
        />
      )}

      {modalView === 'travelers' && isOpen && (
        <TravelersModal
          isOpen={true}
          closeModal={() => closeModal()}
          packageDetails={currentOfferPackage}
          travelers={travelers}
          onSuccess={onTravelersModalSuccess}
          onChange={handleTravelersChange}
        />
      )}
    </>
  )
}
