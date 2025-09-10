import React, { useMemo } from "react";
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
  const filteredOffers = useMemo(() => {
    const result: Record<number, IGeneratedMultivendorOffer[]> = {};
        
    generatedMultivendorOffers.forEach((offer) => {
      // If offer has no foodType property, include it in results (add by room type)
      if (!('foodType' in offer) || offer.foodType === undefined) {
        if (!result[offer.roomType]) {
          result[offer.roomType] = [offer];
        } else {
          result[offer.roomType].push(offer);
        }
        return;
      }

      // If offer has foodType property, only include if it matches selectedMealPlan
      if (offer.foodType === selectedMealPlan) {
        if (!result[offer.roomType]) {
          result[offer.roomType] = [offer];
        } else {
          result[offer.roomType].push(offer);
        }
      }
    });
    return result;
  }, [selectedMealPlan, generatedMultivendorOffers]);

  return (
    <>
      <VStack align="stretch">
        {loading && <RoomSelectionSkeleton />}

        {generatedMultivendorOffers.length > 0 && (
          <RoomSelection
            filteredOffers={filteredOffers}
            closeBookingDrawer={closeBookingDrawer}
            updateSelectedRoomPackage={updateSelectedRoomPackage}
          />
        )}

        {/* No Results */}
        {!loading && Object.keys(filteredOffers).length === 0 && (
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
