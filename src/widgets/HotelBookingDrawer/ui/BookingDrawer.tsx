import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SideDrawer } from "@/components/SideDrawer";
import { useBookingDrawer } from "@/modules/packages/hooks/useBookingDrawer";
import useMultivendorOffer from "@/modules/packages/hooks/useMultivendorOffer";
import { ActionsSection } from "./ActionsSection";
import { PackagesFields } from "@/modules/packages/data/packagesEnums";
import { RoomTypesList } from "./RoomTypesList";
import { VStack } from "@chakra-ui/react";

export const BookingDrawer: React.FC<{ childrenAges: number[] }> = ({ childrenAges }) => {
  const { t } = useTranslation();
  const {
    isOpen,
    packageData,
    selectedMealPlan,
    closeBookingDrawer,
    updateMealPlan,
    updateSelectedRoomPackage,
  } = useBookingDrawer();

  const {
    generateMultivendorOffers,
    loading,
    clearGeneratedMultivendorOffers,
    generatedMultivendorOffers,
  } = useMultivendorOffer();
  
  const [lateCheckout, setLateCheckout] = useState(false);

  useEffect(() => {
    if (isOpen) {
      generateMultivendorOffers(
        {
          [PackagesFields.hotelId]: packageData?.hotel?.id || 0,
          [PackagesFields.dateFrom]: packageData?.checkin || "",
          [PackagesFields.dateTo]: packageData?.checkout || "",
          [PackagesFields.adults]: packageData?.adultTravelers || 0,
          [PackagesFields.childs]: childrenAges,
          [PackagesFields.lateCheckout]: lateCheckout,
          [PackagesFields.bookingType]: 2,
        },
      );
    }
    return () => {
      clearGeneratedMultivendorOffers();
    };
  }, [lateCheckout, packageData, isOpen]);

  const handleLateCheckoutChange = (value: boolean) => {
    setLateCheckout(value);
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
            generatedMultivendorOffers={generatedMultivendorOffers}
            lateCheckout={lateCheckout}
            handleLateCheckoutChange={handleLateCheckoutChange}
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
