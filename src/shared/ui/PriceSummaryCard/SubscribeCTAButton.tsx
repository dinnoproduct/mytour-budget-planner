import { Box, Flex } from "@chakra-ui/react";
import { Icon, Text } from "@ui";
import { useTranslation } from "react-i18next";

export const SubscribeCTAButton = ({ onOpen }: { onOpen: () => void }) => {
  const { t } = useTranslation();

  return (
    <Box
      gridArea="subscribeCTA"
      mt={{ base: 2, md: 6 }}
      px={{ base: 4, md: 0 }}
    >
      <Box width="full"
        bgColor="gray.700"
        color="white"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        cursor="pointer"
        transition="all 0.2s ease-in-out"
        _hover={{ bgColor: "gray.800" }}
        _active={{ bgColor: "gray.900" }}
        borderRadius={"lg"}
        p={4}
        onClick={onOpen}>
        <Flex display="flex" alignItems="center" gap={2}>
          <Box
            backgroundColor="green.500"
            borderRadius="full"
            display="flex"
            alignItems="center"
            p={1}
          >
            <Icon name="fluent-alert" size="16" color="white" />
          </Box>
          <Text size="sm" fontWeight={"semibold"} color="white">
            {t("priceSummaryCard.subscribeCTA")}
          </Text>
        </Flex>
        <Icon name="chevron-right" size="16" color="white" />
      </Box>
    </Box>
  );
};
