import { useEffect, useMemo, useState } from "react";
import {
  type PackageEntity,
  useCalculatePrepayment,
  useCurrentHotelPackageOffer,
} from "@entities/package";
import { useSearchParams } from "react-router-dom";
import moment from "moment";

export const useBookingConfig = (
  defaultTourPackage: PackageEntity,
  offerId?: number,
) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const roomId = useMemo(() => {
    const roomId = searchParams.get("roomId");

    return roomId ? parseInt(roomId, 10) : 0;
  }, [searchParams]);

  const mealId = useMemo(() => {
    const mealId = searchParams.get("mealId");

    return mealId ? parseInt(mealId, 10) : -1;
  }, [searchParams]);

  const [bookingData, setBookingData] = useState({
    checkIn: new Date(defaultTourPackage.checkin),
    checkOut: new Date(defaultTourPackage.checkout),
    travelersData: {
      adultsCount: defaultTourPackage.adultTravelers,
      childrenCount:
        defaultTourPackage.childrenTravelers +
        defaultTourPackage.infantTravelers,
      childrenAges:
        searchParams
          .get("childrenAges")
          ?.split(",")
          .filter(Boolean)
          .map(Number) || [],
    },
    hotelId: defaultTourPackage.hotel.id,
    roomId,
    mealId,
  });

  const updateBookingData = (data: Partial<typeof bookingData>) => {
    setBookingData((prevState) => {
      const updatedData = { ...prevState, ...data };

      setSearchParams({
        city: searchParams.get("city") || "0",
        adultsCount: String(updatedData.travelersData.adultsCount),
        childrenCount: String(updatedData.travelersData.childrenCount),
        childrenAges: updatedData.travelersData.childrenAges.join(","),
        hotelId: String(updatedData.hotelId),
        roomId: String(updatedData.roomId),
        from: moment(updatedData.checkIn).format("YYYY-MM-DD"),
        to: moment(updatedData.checkOut).format("YYYY-MM-DD"),
        mealId: String(updatedData.mealId),
        travelAgency: String(defaultTourPackage.travelAgency.id),
      });

      return updatedData;
    });
  };
  
  const {
    data: currentOfferPackage,
    refetch: refetchCurrentOfferPackage,
    isFetching: isFetchingCurrentOfferPackage,
  } = useCurrentHotelPackageOffer(
    {
      offerId: offerId || 0,
      travelAgency: defaultTourPackage.travelAgency.id,
    },
    {
      enabled: !!offerId && !!defaultTourPackage.travelAgency.id,
    },
  );

  const isNotFound = useMemo(
    () => !isFetchingCurrentOfferPackage && currentOfferPackage === null,
    [currentOfferPackage, isFetchingCurrentOfferPackage],
  );

  useEffect(() => {
    offerId && refetchCurrentOfferPackage();
  }, [offerId, refetchCurrentOfferPackage]);

  // calculate prepayment
  const { data: prepaymentInfo = null, ...rest } = useCalculatePrepayment(
    {
      travelAgencyId: defaultTourPackage.travelAgency.id,
      bookingType: 2,
      destinationId: defaultTourPackage.city.id,
      startDate: currentOfferPackage?.checkin || "",
      fullPrice: currentOfferPackage?.price || 0,
      calculationSource: "search",
    },
    { enabled: !!currentOfferPackage && !!currentOfferPackage?.checkin },
  );

  const isCalculatingPrepayment = useMemo(() => {
    return rest.isPending || rest.isRefetching;
  }, [rest.isPending, rest.isRefetching]);

  return {
    bookingData,
    updateBookingData,
    isNotFound,
    currentOfferPackage,
    prepaymentInfo,
    isLoadingTourPackage: isFetchingCurrentOfferPackage,
    isCalculatingPrepayment,
  };
};
