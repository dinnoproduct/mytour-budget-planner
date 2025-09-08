import { useRecoilState } from "recoil";
import { bookingDrawerAtom } from "../store/store";
import { type PackageEntity } from "@entities/package";
import { IGeneratedMultivendorOffer } from "../data/packagesTypes";
import { useMemo } from "react";

export const useBookingDrawer = () => {
  const [bookingDrawer, setBookingDrawer] = useRecoilState(bookingDrawerAtom);

  const openBookingDrawer = (packageData: PackageEntity) => {
    setBookingDrawer({
      isOpen: true,
      packageData,
      selectedMealPlan: 0,
      selectedRoomPackage: null,
    });
  };

  const closeBookingDrawer = () => {
    setBookingDrawer((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  const clearBookingDrawerData = () => {
    setBookingDrawer((prev) => ({
      ...prev,
      isOpen: false,
      packageData: null,
      selectedMealPlan: 0,
      selectedRoomPackage: null,
    }));
  };

  const updateMealPlan = (selectedMealPlan: number) => {
    setBookingDrawer((prev) => ({
      ...prev,
      selectedMealPlan,
    }));
  };

  const updateSelectedRoomPackage = (offer: IGeneratedMultivendorOffer) => {
    setBookingDrawer((prev) => ({
      ...prev,
      selectedRoomPackage: offer,
      packageData: prev.packageData
        ? {
            ...prev.packageData,
            offerId: offer.offerId,
            foodType: offer.foodType,
            roomType: offer.roomType,
            price: offer.price,
            partnerPrice: offer.partnerPrice,
            priceInCurrency: offer.priceInCurrency.toString(),
          }
        : prev.packageData,
    }));
  };

  const isHotelPackage = useMemo(
    () => !bookingDrawer.packageData?.destinationFlight?.departureDate,
    [bookingDrawer.packageData?.destinationFlight?.departureDate],
  );

  return {
    isOpen: bookingDrawer.isOpen,
    packageData: bookingDrawer.packageData,
    selectedMealPlan: bookingDrawer.selectedMealPlan,
    selectedRoomPackage: bookingDrawer.selectedRoomPackage,
    openBookingDrawer,
    closeBookingDrawer,
    clearBookingDrawerData,
    updateMealPlan,
    updateSelectedRoomPackage,
    isHotelPackage,
  };
};
