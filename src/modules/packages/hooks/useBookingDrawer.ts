import { useRecoilState } from "recoil";
import { bookingDrawerAtom } from "../store/store";
import { IGeneratedMultivendorOffer } from "../data/packagesTypes";
import { useMemo } from "react";
import { useSelectedPackage } from "./useSelectedPackage";

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

  const updateSelectedRoomPackage = (offer: IGeneratedMultivendorOffer) => {
    setBookingDrawer((prev) => ({
      ...prev,
      selectedRoomOffer: offer,
    }));

    if (selectedPackage) {
      const updatedPackage = {
        ...selectedPackage,
        offerId: offer.offerId,
        foodType: offer.foodType,
        roomType: offer.roomType,
        travelAgency: offer.agency,
        currency: offer.currency,
        nights: offer.nights,
        price: offer.price,
        priceInCurrency: offer.priceInCurrency.toString(),
        rate: offer.rate,
        prepaymentType: offer.prepaymentType,
        prepaymentInfo: offer.prepaymentInfo,
        destinationFlight: {
          ...selectedPackage.destinationFlight,
          id: offer.departureFlight.id,
          departureDate: offer.departureFlight.departureDate,
          airCompany: offer.departureFlight.airCompany,
        },
        returnFlight: {
          ...selectedPackage.returnFlight,
          departureDate: offer.returnFlight.departureDate,
          airCompany: {
            ...selectedPackage.returnFlight.airCompany,
            id:
              offer.returnFlight.airCompany?.id ||
              selectedPackage.returnFlight.airCompany.id,
          },
        },
        checkout: offer.checkout,
        checkin: offer.checkin,
      };

      storeSelectedPackage(updatedPackage);
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
