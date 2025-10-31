import { Box, Flex, Link, useBreakpointValue } from "@chakra-ui/react";
import { Heading, Text, Button } from "@ui";
import { useTranslation } from "react-i18next";
import { ContactSection } from "./ContactSection";

export const CtaBanner = () => {
  const { t } = useTranslation();
  const buttonSize = useBreakpointValue({ base: "md", sm: "lg" }) as
    | "md"
    | "lg";

  return (
    <Box
      width="full"
      minH={{ base: "96", sm: "111" }}
      position="relative"
      overflow="hidden"
      bgImage="url(/assets/images/faq/contacts-bg.png)"
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
    >
      {/* Dark overlay for better text readability */}
      <Box position="absolute" inset={0} bg="blackAlpha.400" />

      <Box position="relative" zIndex={1} px={{ base: 4, sm: 8 }} py={20}>
        <Flex
          direction="column"
          align="center"
          justify="center"
          textAlign="center"
          maxW="container.lg"
          mx="auto"
        >
          <Heading
            fontSize={{ base: "xl", sm: "3xl" }}
            lineHeight={{ base: "shorter", sm: "short" }}
            as="h2"
            mb={{ base: 3, sm: 4 }}
            color="white"
          >
            {t("faq.cta.title")}
          </Heading>

          <Text
            fontSize={{ base: "sm", sm: "lg" }}
            lineHeight={{ base: 5, sm: 7 }}
            maxW={{ base: "600px", md: "800px" }}
            color="white"
          >
            {t("faq.cta.subtitle")}
          </Text>

          <Button
            variant="solid-blue"
            size={buttonSize}
            iconBefore="phone"
            mt={{ base: 8, sm: 6 }}
            py={{ base: 3, sm: 3.5 }}
            px={{ base: 6, sm: 8 }}
          >
            {t("call")}
          </Button>

          <Text
            fontSize={{ base: "sm", sm: "lg" }}
            lineHeight={{ base: 5, sm: 7 }}
            maxW={{ base: "600px", md: "800px" }}
            color="white"
            mt={6}
            mb={6}
          >
            {t("faq.cta.orWriteUs")}
          </Text>

          {/* Contact Section */}
          <ContactSection />
        </Flex>
      </Box>
    </Box>
  );
};
