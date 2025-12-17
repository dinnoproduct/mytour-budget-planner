import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SideDrawer } from "@/components/SideDrawer";
import { useBookingDrawer } from "@/modules/packages/hooks/useBookingDrawer";
import { ActionsSection } from "./ActionsSection";
import { RoomTypesList } from "./RoomTypesList";
import { VStack } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { isLateCheckoutAtom } from "@/modules/packages/store/store";
import { IGeneratedMultivendorOffer } from "@/modules/packages/data/packagesTypes";
import { BookingStep, metaEvents } from "@/shared/configs/metaEvents";
import { useUserContext } from "@/entities/user";
import { useModalContext } from "@/app/providers";

export const BookingDrawer: React.FC<{
  childrenAges: number[];
  generatedMultivendorOffers: IGeneratedMultivendorOffer[];
  mealPlans: { key: number; label: string; labelArm: string }[];
  loading: boolean;
}> = ({ childrenAges, generatedMultivendorOffers, mealPlans, loading }) => {
  const { t } = useTranslation();
  const {
    isOpen,
    selectedPackage,
    selectedMealPlan,
    closeBookingDrawer,
    updateMealPlan,
    updateSelectedRoomPackage,
    isHotelPackage,
  } = useBookingDrawer();

  const { user } = useUserContext();
  const { dispatchModal } = useModalContext();

  useEffect(() => {
    updateMealPlan(mealPlans[0].key);
  }, [JSON.stringify(mealPlans)]);

  const [isLateCheckout, setIsLateCheckout] =
    useRecoilState(isLateCheckoutAtom);

  const hanldePackageSelect = (selectedPackage: IGeneratedMultivendorOffer) => {
    handleLogEvent({ name: BookingStep.RoomSelection, number: 1 });
    if (!user?.id) {
      dispatchModal({
        type: "open",
        modalType: "auth",
        props: {
          view: "signUp",
          isCloseOnSuccess: true,
          onSuccess: () => {
            updateSelectedRoomPackage(selectedPackage);
          },
        },
      });
      return;
    }
    updateSelectedRoomPackage(selectedPackage);
  };

  const handleLateCheckoutChange = (value: boolean) => {
    setIsLateCheckout(value);
  };

  function handleLogEvent(step: { name: BookingStep; number: number }) {
    if (selectedPackage) {
      metaEvents.bookingStepCompleted({
        hotel_id: selectedPackage.hotel.id,
        step_number: step.number,
        step_name: step.name,
      });
    }
  }

  return (
    <SideDrawer
      isOpen={isOpen}
      onClose={closeBookingDrawer}
      title={t`bookingDetails`}
      placement="right"
    >
      <VStack spacing={6} align="stretch">
        {generatedMultivendorOffers.length > 0 && (
          <ActionsSection
            selectedMealPlan={selectedMealPlan}
            updateMealPlan={updateMealPlan}
            mealPlans={mealPlans}
            lateCheckout={isLateCheckout}
            handleLateCheckoutChange={handleLateCheckoutChange}
            isHotelPackage={isHotelPackage}
          />
        )}

        <RoomTypesList
          selectedMealPlan={selectedMealPlan}
          generatedMultivendorOffers={generatedMultivendorOffers}
          updateSelectedRoomPackage={hanldePackageSelect}
          closeBookingDrawer={closeBookingDrawer}
          loading={loading}
        />
      </VStack>
    </SideDrawer>
  );
};
