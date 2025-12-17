import React, { useMemo } from "react";
import { VStack } from "@chakra-ui/react";
import { IGeneratedMultivendorOffer } from "@/modules/packages/data/packagesTypes";
import { RoomTypeSection } from "./RoomTypeSection";

export interface RoomSelectionProps {
  filteredOffers: Map<number, IGeneratedMultivendorOffer[]>;
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
      {Array.from(filteredOffers).map(([key, value]) => (
        <RoomTypeSection
          key={key}
          roomTypeKey={key}
          roomTypeOffers={value}
          closeBookingDrawer={closeBookingDrawer}
          updateSelectedRoomPackage={updateSelectedRoomPackage}
        />
      ))}
    </VStack>
  );
};
