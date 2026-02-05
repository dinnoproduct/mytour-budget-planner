import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { PaymentModal } from "./PaymentModal";
import { TravelersModal } from "@widgets/TravelersModal";
import { BookingProgressBar } from "./BookingProgressBar";
import type { BookingFlowProps } from "@widgets/BookingFlow/ui/types.ts";
import { useBookingFlow } from "../hooks";
import { PaymentSuccessModal } from "@entities/package";
import { BookingSuccessView } from "./BookingSuccessView";
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
  renderAsPage = false,
  onNavigateToMyPackages,
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

  const [paymentView, setPaymentView] = useState(paymentModalView);
  const currentPaymentView = modalView === "payment" ? paymentView : "paymentForm";
  const progressStep =
    modalView === "success"
      ? 4
      : modalView === "travelers"
        ? 1
        : currentPaymentView === "paymentForm"
          ? 2
          : currentPaymentView === "previewDetails"
            ? 3
            : 4;

  return (
    <Box width="full">
      {renderAsPage && (
        <Box
          width="full"
          maxW="container.lg"
          mx="auto"
          px={4}
          py={4}
          borderBottom="1px solid"
          borderColor="gray.100"
        >
          <BookingProgressBar step={progressStep} />
        </Box>
      )}

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
          renderAsPage={renderAsPage}
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
          onViewChange={setPaymentView}
          isLoadingBooking={isLoadingBooking}
          isBooked={isBooked}
          prepaymentInfo={prepaymentInfo}
          travelers={travelers}
          validatePromoCode={validatePromoCode}
          handleLogEvent={handleLogEvent}
          skipPreviewStep={!!request}
          renderAsPage={renderAsPage}
          onNavigateToMyPackages={onNavigateToMyPackages}
        />
      )}

      {modalView === "success" &&
        (renderAsPage && onNavigateToMyPackages ? (
          <BookingSuccessView onGoToMyPackages={onNavigateToMyPackages} />
        ) : (
          <PaymentSuccessModal closeModal={() => closeModal()} />
        ))}
    </Box>
  );
};
