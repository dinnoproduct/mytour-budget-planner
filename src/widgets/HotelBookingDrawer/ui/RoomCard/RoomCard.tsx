import React from "react";
import { Card, Divider } from "@chakra-ui/react";
import { IGeneratedMultivendorOffer } from "../../../../modules/packages/data/packagesTypes";
import { Header } from "./Header";
import { Footer } from "./Footer";

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

      <Footer
        offer={offer}
        closeBookingDrawer={closeBookingDrawer}
        updateSelectedRoomPackage={updateSelectedRoomPackage}
      />
    </Card>
  );
};
