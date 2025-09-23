import { Box, HStack, Text, Avatar, VStack, Flex } from "@chakra-ui/react";
import { IGeneratedMultivendorOffer } from "@/modules/packages/data/packagesTypes";
import { useTranslation } from "react-i18next";
import { Icon, Tooltip } from "@/shared/ui";

export const Header: React.FC<{
  offer: IGeneratedMultivendorOffer;
  freeCancellationDate: string | null;
}> = ({ offer, freeCancellationDate }) => {
  const { t } = useTranslation();

  return (
    <HStack spacing={3} justify="space-between" align="center">
      {/* Agency Info */}
      <Box>
        <HStack>
          <Avatar name={offer.agency?.name} size="sm" />
          <Text fontSize="sm" color="gray.900" whiteSpace="nowrap">
            {offer.agency?.name || "Unknown Agency"}
          </Text>
        </HStack>
      </Box>

      {/* Info Section */}

      {freeCancellationDate && (
        <HStack spacing={1} align="center">
          <Text fontSize="xs" color="blue.500" whiteSpace="nowrap">
            {t`bookWithoutPayment`}
          </Text>
          <Tooltip label={t`noPrepaymentText`}>
            <Flex justify="center" align="center">
              <Icon name="info-outline" size="16" color="blue.500" />
            </Flex>
          </Tooltip>
        </HStack>
      )}
    </HStack>
  );
};
