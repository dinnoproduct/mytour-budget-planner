import { PaymentModal } from "./PaymentModal";
import { TravelersModal } from "@widgets/TravelersModal";
import type { BookingFlowProps } from "@widgets/BookingFlow/ui/types.ts";
import { useBookingFlow } from "../hooks";
import { PaymentSuccessModal } from "@entities/package";
import { Travelers } from "@/widgets/TravelersModal/ui/types";
import { generateEventId, metaEvents } from "@/shared/configs/metaEvents";
import { useRecoilValue } from "recoil";
import { isLateCheckoutAtom } from "@/modules/packages/store/store";

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

  function handleTravelersModalSuccess(travelers: Travelers) {
    onTravelersModalSuccess(travelers);
    if (packageDetails) {
      metaEvents.bookingStepCompleted({
        event_id: generateEventId(),
        hotel_id: packageDetails.hotel.id,
        step_number: 2, // TODO: add step_number
        step_name: "guest_details_entered",
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
          onSuccess={handleTravelersModalSuccess}
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
        />
      )}

      {modalView === "success" && (
        <PaymentSuccessModal closeModal={() => closeModal()} />
      )}
    </>
  );
};
