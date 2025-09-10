import React, { useMemo } from "react";
import { VStack } from "@chakra-ui/react";
import { IGeneratedMultivendorOffer } from "@/modules/packages/data/packagesTypes";
import { RoomTypeSection } from "./RoomTypeSection";

export interface RoomSelectionProps {
  filteredOffers: Record<number, IGeneratedMultivendorOffer[]>;
  closeBookingDrawer: () => void;
  updateSelectedRoomPackage: (offer: IGeneratedMultivendorOffer) => void;
}

export const RoomSelection: React.FC<RoomSelectionProps> = ({
  filteredOffers,
  closeBookingDrawer,
  updateSelectedRoomPackage,
}) => {
  return (
    <VStack spacing={6} align="stretch" width="full">
      {Object.keys(filteredOffers).map((roomTypeKey) => (
        <RoomTypeSection
          key={roomTypeKey}
          roomTypeKey={roomTypeKey}
          roomTypeOffers={filteredOffers[Number(roomTypeKey)]}
          closeBookingDrawer={closeBookingDrawer}
          updateSelectedRoomPackage={updateSelectedRoomPackage}
        />
      ))}
    </VStack>
  );
};
