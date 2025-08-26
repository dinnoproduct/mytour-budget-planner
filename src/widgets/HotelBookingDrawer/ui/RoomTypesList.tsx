import React, { useState } from 'react';
import { Box, VStack, HStack, Text, Button, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { RoomSelection } from './RoomSelection';
import { IGeneratedMultivendorOffer } from '@/modules/packages/data/packagesTypes';

interface IRoomTypesListProps { 
  selectedMealPlan: number;
  generatedMultivendorOffers: IGeneratedMultivendorOffer[];
  loading: boolean;
  updateChildrenAges: (childrenAges: number[]) => void;
  closeBookingDrawer: () => void;
}

export const RoomTypesList: React.FC<IRoomTypesListProps> = ({ selectedMealPlan, generatedMultivendorOffers, loading, updateChildrenAges, closeBookingDrawer }) => {
  return (
    <>
      <VStack align="stretch">
        {/* Loading State */}
        {loading && (
          <Box textAlign="center" py={12}>
            <Spinner size="xl" color="blue.500" mb={4} />
          </Box>
        )}

        {/* Results */}
        {generatedMultivendorOffers.length > 0 && (
          <RoomSelection
            offers={generatedMultivendorOffers}
            selectedMealPlan={selectedMealPlan}
            updateChildrenAges={updateChildrenAges}
            closeBookingDrawer={closeBookingDrawer}
          />
        )}

        {/* No Results */}
        {!loading && generatedMultivendorOffers.length === 0 && (
          <Box textAlign="center" py={12} bg="gray.50" borderRadius="lg">
            <Text fontSize="lg" color="gray.500" mb={4}>
              No offers generated yet. Click the button above to generate multivendor offers.
            </Text>
            <Text fontSize="sm" color="gray.400">
              This will fetch room offers from multiple travel agencies based on your search criteria.
            </Text>
          </Box>
        )}
      </VStack>
    </>
  );
};
