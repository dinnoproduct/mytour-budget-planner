import { PaymentModal } from "./PaymentModal";
import { TravelersModal } from "@widgets/TravelersModal";
import type { BookingFlowProps } from "@widgets/BookingFlow/ui/types.ts";
import { useBookingFlow } from "../hooks";
import { PaymentSuccessModal } from "@entities/package";
import { useRecoilValue } from "recoil";
import { isLateCheckoutAtom } from "@/modules/packages/store/store";
import { BookingStep, metaEvents } from "@/shared/configs/metaEvents";

export const BookingFlow = ({
  packageDetails,
  initialView,
  childrenAges,
  request,
  isOpen,
  onClose,
  defaultTravelers,
  isBooked,
}: BookingFlowProps) => {
  const isLateCheckout = useRecoilValue(isLateCheckoutAtom);
  const {
    paymentModalView,
    onTravelersModalSuccess,
    onPaymentModalSuccess,
    openTravelersModal,
    travelers,
    modalView,
    closeModal,
    handleTravelersChange,
    isLoadingBooking,
    isLoadingTravelersModal,
    prepaymentInfo,
    validatePromoCode,
  } = useBookingFlow({
    initialView,
    packageDetails,
    onClose,
    isOpen,
    childrenAges,
    request,
    defaultTravelers,
    isLateCheckout,
  });

  if (!packageDetails?.offerId || !isOpen) {
    return null;
  }

  function handleLogEvent(step: { name: BookingStep; number: number }) {
    if (packageDetails) {
      metaEvents.bookingStepCompleted({
        hotel_id: packageDetails.hotel.id,
        step_number: step.number,
        step_name: step.name,
      });
    }
  }

  return (
    <>
      {modalView === "travelers" && (
        <TravelersModal
          isOpen={true}
          closeModal={() => closeModal()}
          packageDetails={packageDetails}
          travelers={travelers}
          onSuccess={onTravelersModalSuccess}
          handleLogEvent={handleLogEvent}
          onChange={handleTravelersChange}
          isLoading={isLoadingTravelersModal}
        />
      )}

      {modalView === "payment" && (
        <PaymentModal
          isOpen={true}
          closeModal={() => closeModal()}
          packageDetails={packageDetails}
          onSuccess={onPaymentModalSuccess}
          view={paymentModalView}
          onBackClick={
            initialView === "payment" ? undefined : openTravelersModal
          }
          isLoadingBooking={isLoadingBooking}
          isBooked={isBooked}
          prepaymentInfo={prepaymentInfo}
          travelers={travelers}
          validatePromoCode={validatePromoCode}
          handleLogEvent={handleLogEvent}
          skipPreviewStep={!!request}
        />
      )}

      {modalView === "success" && (
        <PaymentSuccessModal closeModal={() => closeModal()} />
      )}
    </>
  );
};
