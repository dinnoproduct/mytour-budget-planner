import React from "react";
import { Box, Card, Divider } from "@chakra-ui/react";
import { IGeneratedMultivendorOffer } from "../../../../modules/packages/data/packagesTypes";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useBookingDrawer } from "@/modules/packages/hooks/useBookingDrawer";
import { Body } from "./Body";
import { FlightInfoSection } from "./FlightInfoSection";
import { useFreeCancellation } from "@/widgets/PackageBookingConfig/hooks";

export interface RoomCardProps {
  fullWidth?: boolean;
  offer: IGeneratedMultivendorOffer;
  closeBookingDrawer: () => void;
  updateSelectedRoomPackage: (offer: IGeneratedMultivendorOffer) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  fullWidth = false,
  offer,
  closeBookingDrawer,
  updateSelectedRoomPackage,
}) => {
  const { isHotelPackage, packageData } = useBookingDrawer();
  const { freeCancellationDate } = useFreeCancellation(
    new Date(offer.checkin),
    new Date(offer.checkout),
  );

  return (
    <Card
      p={3}
      bg="gray.100"
      borderRadius="lg"
      cursor="pointer"
      minW={fullWidth ? "100%" : "313px"}
    >
      <Header offer={offer} />

      <Divider my={3} color="white" borderWidth="1px" />

      {!isHotelPackage && (
        <>
          <FlightInfoSection
            airCompanyName={packageData?.destinationFlight?.airCompany?.name || ''}
            departureDate={packageData?.destinationFlight?.departureDate || ''}
            returnDate={packageData?.returnFlight?.departureDate || ''}
          />
          {freeCancellationDate && (
            <Body offer={offer} freeCancellationDate={freeCancellationDate} />
          )}
          <Divider my={3} color="white" borderWidth="1px" />
        </>
      )}

      <Footer
        offer={offer}
        closeBookingDrawer={closeBookingDrawer}
        updateSelectedRoomPackage={updateSelectedRoomPackage}
      />
    </Card>
  );
};
