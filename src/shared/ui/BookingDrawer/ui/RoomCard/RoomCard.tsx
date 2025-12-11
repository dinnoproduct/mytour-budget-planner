import React from "react";
import { Card, Divider, VStack } from "@chakra-ui/react";
import { IGeneratedMultivendorOffer } from "@/modules/packages/data/packagesTypes";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useBookingDrawer } from "@/modules/packages/hooks/useBookingDrawer";
import { FreeCancellationInfo } from "./FreeCancellationInfo";
import { FlightInfoSection } from "./FlightInfoSection";
import { useFreeCancellation } from "@shared/hooks";

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
  const { isHotelPackage, selectedPackage } = useBookingDrawer();

  return (
    <Card
      p={3}
      bg="gray.100"
      borderRadius="lg"
      cursor="pointer"
      width={fullWidth ? "100%" : "313px"}
      flexShrink={0}
    >
      <Header offer={offer} />

      <Divider my={3} color="white" borderWidth="1px" />

      {!isHotelPackage && (
        <>
          <VStack spacing={3} align="stretch">
            <FlightInfoSection
              airCompanyName={offer?.departureFlight?.airCompany?.name || ""}
              departureDate={offer?.departureFlight?.departureDate || ""}
              returnDate={offer?.returnFlight?.departureDate || ""}
            />
          </VStack>
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
