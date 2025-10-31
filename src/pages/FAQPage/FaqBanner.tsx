import { Box, Flex } from "@chakra-ui/react";
import { Heading, Text } from "@ui";
import { useTranslation } from "react-i18next";

export const FaqBanner = () => {
  const { t } = useTranslation();

  return (
    <Box
      width="full"
      minH={80}
      bgImage="url(/assets/images/faq/banner.png)"
      bgPosition="center"
      bgSize="cover"
      bgRepeat="no-repeat"
      position="relative"
    >
      {/* Dark overlay for better text readability */}
      <Box
        position="absolute"
        inset={0}
        bg="blackAlpha.400"
      />

      {/* Title and Subtitle */}
      <Box position="relative" zIndex={1} px={{ base: 4, sm: 8 }} py="60px">
        <Box maxW="container.lg" mx="auto" textAlign="center">
          <Heading
            fontSize={{
              base: "xl",
              sm: "3xl",
            }}
            lineHeight={{ base: 'shorter', sm: 'short' }}
            as="h1"
            mb={3}
            color="gray.50"
          >
            {t("faq.title")}
          </Heading>

          <Text
            fontSize={{
              base: "sm",
              sm: "lg",
            }}
            lineHeight={{ base: 5, sm: 7 }}
            color="gray.50"
          >
            {t("faq.subtitle")}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
