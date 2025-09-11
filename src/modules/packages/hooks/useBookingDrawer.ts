import { useRecoilState } from "recoil";
import { bookingDrawerAtom, selectedPackageAtom } from "../store/store";
import { type PackageEntity } from "@entities/package";
import { IGeneratedMultivendorOffer } from "../data/packagesTypes";
import { useMemo } from "react";
import { useSelectedPackage } from "./useSelectedPackage";

export const useBookingDrawer = () => {
  const [bookingDrawer, setBookingDrawer] = useRecoilState(bookingDrawerAtom);

  const { storeSelectedPackage, selectedPackage, clearSelectedPackage } =
    useSelectedPackage();

  const openBookingDrawer = (packageData: PackageEntity) => {
    storeSelectedPackage(packageData);
    setBookingDrawer({
      isOpen: true,
      selectedMealPlan: packageData.foodType,
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

  const updateSelectedRoomPackage = (offer: IGeneratedMultivendorOffer) => {
    setBookingDrawer((prev) => ({
      ...prev,
      selectedRoomOffer: offer,
    }));

    if (selectedPackage) {
      storeSelectedPackage({
        ...selectedPackage,
        offerId: offer.offerId,
        foodType: offer.foodType,
        roomType: offer.roomType,
        price: offer.price,
        priceInCurrency: offer.priceInCurrency.toString(),
      });
    }
  };

  const isHotelPackage = useMemo(
    () => !selectedPackage?.destinationFlight?.departureDate,
    [selectedPackage?.destinationFlight?.departureDate],
  );

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
