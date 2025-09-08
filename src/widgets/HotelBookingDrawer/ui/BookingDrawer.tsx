import React, { useEffect, useMemo, useState } from "react";
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

export const BookingDrawer: React.FC<{ childrenAges: number[] }> = ({ childrenAges }) => {
  const { t } = useTranslation();
  const {
    isOpen,
    packageData,
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

  useEffect(()=>{
    updateMealPlan(mealPlans[0].key)
  }, [JSON.stringify(mealPlans)])
  
  const [isLateCheckout, setIsLateCheckout] = useRecoilState(isLateCheckoutAtom);

  useEffect(() => {
    if (isOpen) {
      generateMultivendorOffers(
        {
          [PackagesFields.hotelId]: packageData?.hotel?.id || 0,
          [PackagesFields.dateFrom]: packageData?.checkin || "",
          [PackagesFields.dateTo]: packageData?.checkout || "",
          [PackagesFields.adults]: packageData?.adultTravelers || 0,
          [PackagesFields.childs]: childrenAges,
          [PackagesFields.lateCheckout]: isLateCheckout,
          [PackagesFields.bookingType]: isHotelPackage ? 2 : 1,
        },
      );
    }
    return () => {
      clearGeneratedMultivendorOffers();
    };
  }, [isLateCheckout, packageData, isOpen, isHotelPackage]);

  const handleLateCheckoutChange = (value: boolean) => {
    setIsLateCheckout(value);
  };

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
          updateSelectedRoomPackage={updateSelectedRoomPackage}
          closeBookingDrawer={closeBookingDrawer}
        />
      </VStack>
    </SideDrawer>
  );
};
