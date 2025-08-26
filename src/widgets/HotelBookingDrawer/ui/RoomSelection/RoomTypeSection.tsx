import { useMemo } from 'react';
import { Box, Divider, Flex, Text } from '@chakra-ui/react';
import { RoomCard } from '../RoomCard';
import { IGeneratedMultivendorOffer } from '@/modules/packages/data/packagesTypes';
import { DictionaryTypes, useDictionary } from '@/entities/package';

export const RoomTypeSection = ({ roomTypeKey, roomTypeOffers, updateChildrenAges, closeBookingDrawer }: { roomTypeKey: string, roomTypeOffers: IGeneratedMultivendorOffer[], updateChildrenAges: (childrenAges: number[]) => void, closeBookingDrawer: () => void }) => {    
      const { data: roomTypes = [] } = useDictionary(
        'RoomTypeDictionary' as DictionaryTypes.RoomTypeDictionary
      )
    
      const roomType = useMemo<string>(
        () =>
          roomTypes.find(({ key }) => key === Number(roomTypeKey))?.value ||
          '',
        [JSON.stringify(roomTypes)]
      )
    
    return (
        <Box key={roomTypeKey} bg="white" borderRadius="lg">
            <Text fontSize="md" fontWeight="semibold" p={4}>
                Room Type: {roomType}
            </Text>
            <Divider />
            <Flex gap={6} overflowX="auto" px={4} py={3}>
                {roomTypeOffers.map(offer => (
                    <RoomCard
                        fullWidth={roomTypeOffers.length === 1}
                        key={offer.offerId}
                        offer={offer}
                        updateChildrenAges={updateChildrenAges}
                        closeBookingDrawer={closeBookingDrawer}
                    />
                ))}
            </Flex>
        </Box>
    );
};