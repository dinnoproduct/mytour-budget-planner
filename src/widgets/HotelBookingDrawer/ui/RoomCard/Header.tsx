import { Box, HStack, Text, Avatar } from '@chakra-ui/react';
import { IGeneratedMultivendorOffer } from '../../../../modules/packages/data/packagesTypes';

export const Header: React.FC<{ offer: IGeneratedMultivendorOffer }> = ({ offer }) => {
    return (
        <Box>
            <Box>
                <HStack>
                    <Avatar src={offer.agency?.logo} size="sm" />
                    <Text fontSize="sm" color="gray.900">
                        {offer.agency?.name || 'Unknown Agency'}
                    </Text>
                </HStack>
            </Box>
        </Box>
    );
};