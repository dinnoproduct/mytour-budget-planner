import { IGeneratedMultivendorOffer } from '@/modules/packages/data/packagesTypes';
import { Box, VStack, HStack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const Body = ({ offer }: { offer: IGeneratedMultivendorOffer }) => {
    const { t } = useTranslation();

    const formatCancellationDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('hy-AM', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <Box>
            <VStack spacing={3} align="stretch">
                <HStack spacing={4} justify="space-between">
                    <Text fontSize="xs" color="gray.900" mb={1}>
                        {t`freeCancellationUntil`}:  {offer?.cancellationDate ? formatCancellationDate(offer.cancellationDate) : ''}
                    </Text>
                </HStack>
            </VStack>
        </Box>
    );
};