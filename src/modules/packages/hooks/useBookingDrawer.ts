import { useRecoilState } from "recoil";
import { bookingDrawerAtom } from "../store/store";
import { IGeneratedMultivendorOffer } from "../data/packagesTypes";
import { useMemo } from "react";
import { useSelectedPackage } from "./useSelectedPackage";
import { packageUseCases } from "@entities/package";

export const useBookingDrawer = () => {
  const [bookingDrawer, setBookingDrawer] = useRecoilState(bookingDrawerAtom);

  const { storeSelectedPackage, selectedPackage, clearSelectedPackage } =
    useSelectedPackage();

  const openBookingDrawer = () => {
    setBookingDrawer({
      isOpen: true,
      selectedMealPlan: selectedPackage?.foodType || 0,
      selectedRoomOffer: null,
    });
  };

  const closeBookingDrawer = () => {
    setBookingDrawer((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  const clearBookingDrawerData = () => {
    clearSelectedPackage();
    setBookingDrawer((prev) => ({
      ...prev,
      isOpen: false,
      selectedMealPlan: 0,
      selectedRoomOffer: null,
    }));
  };

  const updateMealPlan = (selectedMealPlan: number) => {
    setBookingDrawer((prev) => ({
      ...prev,
      selectedMealPlan,
    }));
  };

  const isHotelPackage = useMemo(
    () => !selectedPackage?.destinationFlight?.departureDate,
    [selectedPackage?.destinationFlight?.departureDate],
  );

  const updateSelectedRoomPackage = async (offer: IGeneratedMultivendorOffer) => {
    setBookingDrawer((prev) => ({
      ...prev,
      selectedRoomOffer: offer,
    }));

    try {
      const travelAgencyId = offer.agency?.id;
      const offerId = offer.offerId;

      if (!travelAgencyId || !offerId) {
        console.error("Missing travel agency ID or offer ID");
        return;
      }

      // Fetch package details from API based on package type
      const packageData = isHotelPackage
        ? await packageUseCases.getHotelPackage(offerId, travelAgencyId)
        : await packageUseCases.getPackage(offerId, travelAgencyId);

      // Store the fetched package
      if (packageData) {
        storeSelectedPackage(packageData);
      }
    } catch (error) {
      console.error("Error fetching package details:", error);
    }
  };

  return {
    isOpen: bookingDrawer.isOpen,
    selectedPackage,
    selectedMealPlan: bookingDrawer.selectedMealPlan,
    selectedRoomOffer: bookingDrawer.selectedRoomOffer,
    openBookingDrawer,
    closeBookingDrawer,
    clearBookingDrawerData,
    updateMealPlan,
    updateSelectedRoomPackage,
    isHotelPackage,
  };
};
