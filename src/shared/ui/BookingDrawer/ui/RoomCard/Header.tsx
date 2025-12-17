import { Box, HStack, Text, Avatar, VStack, Flex } from "@chakra-ui/react";
import { IGeneratedMultivendorOffer } from "@/modules/packages/data/packagesTypes";
import { useTranslation } from "react-i18next";
import { Icon, Tooltip } from "@/shared/ui";

export const Header: React.FC<{
  offer: IGeneratedMultivendorOffer;
  freeCancellationDate?: string;
}> = ({ offer, freeCancellationDate }) => {
  const { t } = useTranslation();

  return (
    <HStack spacing={3} justify="space-between" align="center">
      {/* Agency Info */}
      <HStack spacing={2} minW={0} flex={1}>
        <Avatar name={offer.agency?.name} size="sm" flexShrink={0} />
        <Tooltip label={offer.agency?.name || "Unknown Agency"} placement="top">
          <Text
            fontSize="sm"
            color="gray.900"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            minW={0}
            maxW="120px"
            cursor="pointer"
            _hover={{
              color: "gray.700",
            }}
          >
            {offer.agency?.name || "Unknown Agency"}
          </Text>
        </Tooltip>
      </HStack>

      {/* Info Section */}
      {offer?.prepaymentInfo?.paymentType === 'NoDownPayment' && (
        <HStack spacing={1} align="center" flexShrink={0}>
          <Text fontSize="xs" color="blue.500" whiteSpace="nowrap">
            {t`bookWithoutPayment`}
          </Text>
          <Tooltip label={t('noPrepaymentText', {days: offer?.prepaymentInfo?.minimumAcceptableDaysCount})}>
            <Flex justify="center" align="center">
              <Icon name="info-outline" size="16" color="blue.500" />
            </Flex>
          </Tooltip>
        </HStack>
      )}
    </HStack>
  );
};
