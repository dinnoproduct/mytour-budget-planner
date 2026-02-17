import { useRef, useState } from "react";
import { Box } from "@chakra-ui/react";
import { PaymentModal } from "./PaymentModal";
import { TravelersModal } from "@widgets/TravelersModal";
import { BookingProgressBar } from "./BookingProgressBar";
import { AuthStepView } from "./AuthStepView";
import type { BookingFlowProps } from "@widgets/BookingFlow/ui/types.ts";
import { useBookingFlow } from "../hooks";
import { PaymentSuccessModal } from "@entities/package";
import { useRecoilValue } from "recoil";
import { isLateCheckoutAtom } from "@/modules/packages/store/store";
import { BookingStep, metaEvents } from "@/shared/configs/metaEvents";
import { useUserContext } from "@entities/user";

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
  const { user } = useUserContext();
  const {
    paymentModalView,
    onTravelersModalSuccess,
    onPaymentModalSuccess,
    onAuthSuccess,
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
    renderAsPage,
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

  const startedSignedOutRef = useRef(!user?.id);
  const startedSignedOut = startedSignedOutRef.current;
  const totalSteps = renderAsPage && startedSignedOut ? 5 : 4;
  const [paymentView, setPaymentView] = useState(paymentModalView);
  const currentPaymentView = modalView === "payment" ? paymentView : "paymentForm";
  const progressStep =
    modalView === "success"
      ? totalSteps
      : modalView === "auth"
        ? 1
        : modalView === "travelers"
          ? startedSignedOut
            ? 2
            : 1
          : currentPaymentView === "paymentForm"
            ? startedSignedOut
              ? 3
              : 2
            : currentPaymentView === "previewDetails"
              ? startedSignedOut
                ? 4
                : 3
              : totalSteps;

  return (
    <Box
      width="full"
      {...(renderAsPage && {
        display: 'flex',
        flexDirection: 'column',
        minH: 0,
        flex: 1,
      })}
    >
      {renderAsPage ? (
        <Box
          display="flex"
          flexDirection="column"
          flex={1}
          minH={0}
          width="full"
        >
          <Box
            flex={1}
            minH={0}
            px={{ base: 4, md: 0 }}
            width="full"
          >
            <Box
              position={{ base: 'fixed', md: 'relative' }}
              top={{ base: '80px', md: 0 }}
              left={{ base: 0, md: undefined }}
              right={{ base: 0, md: undefined }}
              zIndex={1}
              bg="white"
              borderBottom={{base: "1px solid", md: "none"}}
              borderColor={{base: "gray.100", md: "transparent"}}
              pt={4}
              pb={{base: 4, md: 0}}
              flexShrink={0}
            >
              <Box maxW="500px" mx="auto" width="full">
                <BookingProgressBar step={progressStep} totalSteps={totalSteps} />
              </Box>
            </Box>
            <Box maxW="500px" mx="auto" width="full" py={4} pt={{ base: '80px', md: 4 }}>
              {modalView === "auth" && (
                <AuthStepView
                  onSuccess={onAuthSuccess}
                  onBackClick={closeModal}
                  renderAsPage={renderAsPage}
                />
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

              {modalView === "success" && (
                <PaymentSuccessModal
                  closeModal={
                    onNavigateToMyPackages ?? (() => closeModal())
                  }
                />
              )}
            </Box>
          </Box>
        </Box>
      ) : (
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

          {modalView === "success" && (
            <PaymentSuccessModal
              closeModal={
                onNavigateToMyPackages ?? (() => closeModal())
              }
            />
          )}
        </>
      )}
    </Box>
  );
};
