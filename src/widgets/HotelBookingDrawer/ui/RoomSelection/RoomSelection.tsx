import React, { useMemo } from 'react';
import { VStack } from '@chakra-ui/react';
import { IGeneratedMultivendorOffer } from '../../../../modules/packages/data/packagesTypes';
import { RoomTypeSection } from './RoomTypeSection';

export interface RoomSelectionProps {
  offers: IGeneratedMultivendorOffer[];
  selectedMealPlan?: number;
  updateChildrenAges: (childrenAges: number[]) => void;
  closeBookingDrawer: () => void;
}

export const RoomSelection: React.FC<RoomSelectionProps> = ({
  offers,
  selectedMealPlan,
  updateChildrenAges,
  closeBookingDrawer
}) => {
  const filteredOffers = useMemo(() => {
    const result: Record<number, IGeneratedMultivendorOffer[]> = {}
    offers.forEach(offer => {
      if (offer.foodType !== selectedMealPlan) {
        return
      }
      if (!result[offer.roomType]) {
        result[offer.roomType] = [offer]
      } else {
        result[offer.roomType].push(offer)
      }
    })
    return result
  }, [selectedMealPlan, offers]);

  return (
    <VStack spacing={6} align="stretch" width="full">
      {Object.keys(filteredOffers).map((roomTypeKey) => (
        <RoomTypeSection
          key={roomTypeKey}
          roomTypeKey={roomTypeKey}
          roomTypeOffers={filteredOffers[Number(roomTypeKey)]}
          updateChildrenAges={updateChildrenAges}
          closeBookingDrawer={closeBookingDrawer}
        />
      ))}
    </VStack>
  );
};
