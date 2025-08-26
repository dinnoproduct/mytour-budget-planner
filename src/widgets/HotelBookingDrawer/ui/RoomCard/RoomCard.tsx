import React from 'react';
import { Card, Divider } from '@chakra-ui/react';
import { IGeneratedMultivendorOffer } from '../../../../modules/packages/data/packagesTypes';
import { Header } from './Header';
import { Footer } from './Footer';

export interface RoomCardProps {
  fullWidth?: boolean;
  offer: IGeneratedMultivendorOffer;
  updateChildrenAges: (childrenAges: number[]) => void;
  closeBookingDrawer: () => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  fullWidth = false,
  offer,
  updateChildrenAges,
  closeBookingDrawer
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

      <Footer offer={offer} updateChildrenAges={updateChildrenAges} closeBookingDrawer={closeBookingDrawer} />
    </Card>
  );
};
