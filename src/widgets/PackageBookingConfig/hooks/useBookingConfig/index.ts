import { useEffect, useMemo, useState } from "react";
import {
  type DictionaryTypes,
  type PackageEntity,
  useCalculatePrepayment,
  useCurrentOfferPackage,
  useDictionary,
  useGenerateOffers,
} from "@entities/package";
import { useSearchParams } from "react-router-dom";

export const useBookingConfig = (defaultTourPackage: PackageEntity, offerId?: number) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const roomId = useMemo(() => {
    const roomId = searchParams.get("roomId");

    return roomId ? parseInt(roomId, 10) : 0;
  }, [searchParams]);
  const [bookingData, setBookingData] = useState({
    fromDate: new Date(defaultTourPackage.destinationFlight.departureDate),
    toDate: new Date(defaultTourPackage.returnFlight.arrivalDate),
    departureFlightId: defaultTourPackage.destinationFlight.id,
    returnFlightId: defaultTourPackage.returnFlight.id,
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
    lateCheckout: false,
    roomId,
  });

  const updateBookingData = (
    data: Partial<typeof bookingData>,
    updateSearchParams: boolean = true,
  ) => {
    setBookingData((prevState) => {
      const updatedData = { ...prevState, ...data };

      if (!updateSearchParams) return updatedData;

      setSearchParams({
        city: searchParams.get("city") || "0",
        adultsCount: String(updatedData.travelersData.adultsCount),
        childrenCount: String(updatedData.travelersData.childrenCount),
        childrenAges: updatedData.travelersData.childrenAges.join(","),
        hotelId: String(updatedData.hotelId),
        roomId: String(updatedData.roomId),
        departureFlightId: String(updatedData.departureFlightId),
        returnFlightId: String(updatedData.returnFlightId),
      });

      return updatedData;
    });
  };

  // offers
  const { data: offers = [], isLoading: isLoadingOffers } = useGenerateOffers(
    {
      flightId: bookingData.departureFlightId,
      returnFlightId: bookingData.returnFlightId,
      adults: bookingData.travelersData.adultsCount,
      childs: bookingData.travelersData.childrenAges,
      hotelId: bookingData.hotelId,
      lateCheckout: bookingData.lateCheckout,
    },
    {
      enabled: true,
    },
  );

  // rooms
  const { data: roomTypes = [] } = useDictionary(
    "RoomTypeDictionary" as DictionaryTypes.RoomTypeDictionary,
  );
  const roomOffers = useMemo(() => {
    if (!offers?.length) return [];

    const offerRoomTypes = roomTypes.filter((roomType) =>
      offers.some((offer) => offer.roomType === roomType.key),
    );

    return offerRoomTypes
      .map((roomType) => {
        const offer = offers.find((offer) => offer.roomType === roomType.key);

        return {
          id: roomType.key,
          name: roomType.value,
          price: offer?.price || 0,
        };
      })
      .sort((a, b) => a.price - b.price);
  }, [JSON.stringify(offers), JSON.stringify(roomTypes)]);

  const isNotFound = useMemo(
    () => !isLoadingOffers && roomOffers.length === 0,
    [roomOffers?.length, isLoadingOffers],
  );

  const {
    data: currentOfferPackage,
    refetch: refetchCurrentOfferPackage,
    isFetching: isFetchingCurrentOfferPackage,
  } = useCurrentOfferPackage(offerId || 0, {
    enabled: !! offerId,
  });

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
    isLoadingTourPackage: isLoadingOffers || isFetchingCurrentOfferPackage,
    isCalculatingPrepayment,
  };
};
