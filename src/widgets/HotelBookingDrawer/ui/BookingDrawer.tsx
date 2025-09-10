import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SideDrawer } from "@/components/SideDrawer";
import { useBookingDrawer } from "@/modules/packages/hooks/useBookingDrawer";
import useMultivendorOffer from "@/modules/packages/hooks/useMultivendorOffer";
import { ActionsSection } from "./ActionsSection";
import { PackagesFields } from "@/modules/packages/data/packagesEnums";
import { RoomTypesList } from "./RoomTypesList";
import { VStack } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { isLateCheckoutAtom } from "@/modules/packages/store/store";
import { IGeneratedMultivendorOffer } from "@/modules/packages/data/packagesTypes";
import { BookingStep, metaEvents } from "@/shared/configs/metaEvents";

export const BookingDrawer: React.FC<{
  childrenAges: number[];
}> = ({ childrenAges }) => {
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

  const {
    generateMultivendorOffers,
    loading,
    clearGeneratedMultivendorOffers,
    generatedMultivendorOffers,
    mealPlans,
  } = useMultivendorOffer();

  useEffect(() => {
    updateMealPlan(mealPlans[0].key);
  }, [JSON.stringify(mealPlans)]);

  const [isLateCheckout, setIsLateCheckout] =
    useRecoilState(isLateCheckoutAtom);

  const hanldePackageSelect = (selectedPackage: IGeneratedMultivendorOffer) => {
    updateSelectedRoomPackage(selectedPackage);
    handleLogEvent({ name: BookingStep.RoomSelection, number: 1 });
  };

  useEffect(() => {
    if (isOpen) {
      generateMultivendorOffers({
        [PackagesFields.hotelId]: selectedPackage?.hotel?.id || 0,
        [PackagesFields.dateFrom]: isHotelPackage
          ? selectedPackage?.checkin || ""
          : selectedPackage?.destinationFlight?.departureDate || "",
        [PackagesFields.dateTo]: isHotelPackage
          ? selectedPackage?.checkout || ""
          : selectedPackage?.returnFlight?.departureDate || "",
        [PackagesFields.adults]: selectedPackage?.adultTravelers || 0,
        [PackagesFields.childs]: childrenAges,
        [PackagesFields.lateCheckout]: isLateCheckout,
        [PackagesFields.bookingType]: isHotelPackage ? 2 : 1,
      });
    }
    return () => {
      clearGeneratedMultivendorOffers();
    };
  }, [isLateCheckout, selectedPackage, isOpen, isHotelPackage]);

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
        {!loading && generatedMultivendorOffers.length > 0 && (
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
          loading={loading}
          updateSelectedRoomPackage={hanldePackageSelect}
          closeBookingDrawer={closeBookingDrawer}
        />
      </VStack>
    </SideDrawer>
  );
};
