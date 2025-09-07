import { IGeneratedMultivendorOffer } from "@/modules/packages/data/packagesTypes";
import { Box, VStack, HStack, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export const FreeCancellationInfo = ({ offer, freeCancellationDate }: { offer: IGeneratedMultivendorOffer, freeCancellationDate: string }) => {
  const { t } = useTranslation();

  return (
    <Box>
      <VStack spacing={3} align="stretch">
        <HStack spacing={4} justify="space-between">
          <Text fontSize="xs" color="gray.900" mb={1}>
            {t`freeCancellationUntil`}: {freeCancellationDate}
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
};
