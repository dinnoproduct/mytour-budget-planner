import React from "react";
import { Box, VStack, Text } from "@chakra-ui/react";
import { RoomSelection, RoomSelectionSkeleton } from "./RoomSelection";
import { IGeneratedMultivendorOffer } from "@/modules/packages/data/packagesTypes";

interface IRoomTypesListProps {
  selectedMealPlan: number;
  generatedMultivendorOffers: IGeneratedMultivendorOffer[];
  loading: boolean;
  closeBookingDrawer: () => void;
  updateSelectedRoomPackage: (offer: IGeneratedMultivendorOffer) => void;
}

export const RoomTypesList: React.FC<IRoomTypesListProps> = ({
  selectedMealPlan,
  generatedMultivendorOffers,
  loading,
  closeBookingDrawer,
  updateSelectedRoomPackage,
}) => {
  return (
    <>
      <VStack align="stretch">
        {loading && <RoomSelectionSkeleton />}

        {generatedMultivendorOffers.length > 0 && (
          <RoomSelection
            offers={generatedMultivendorOffers}
            selectedMealPlan={selectedMealPlan}
            closeBookingDrawer={closeBookingDrawer}
            updateSelectedRoomPackage={updateSelectedRoomPackage}
          />
        )}

        {/* No Results */}
        {!loading && generatedMultivendorOffers.length === 0 && (
          <Box textAlign="center" py={12} bg="gray.50" borderRadius="lg">
            <Text fontSize="lg" color="gray.500" mb={4}>
              No offers generated.
            </Text>
          </Box>
        )}
      </VStack>
    </>
  );
};
