import { Box, Button, FormControl, FormLabel, Input, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const PriceChangeSubscriptionForm = () => {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+374");
  const [phoneInvalid, setPhoneInvalid] = useState(false);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!phone.match(/^\+374\d{8}$/)) {
      setPhoneInvalid(true);
      return;
    }
    // UI-only form for now; wire API in next step.
  };

  return (
    <Box bg="white" rounded={{ base: "none", md: "2xl" }} overflow="hidden">
      <Box px={{ base: 4, md: 6 }} py={{ base: 5, md: 6 }}>
        <form onSubmit={handleSubmit}>
          <VStack align="stretch" spacing={4}>
            <FormControl isRequired>
              <FormLabel color="gray.700" fontSize="sm" mb={2}>
                {t("priceSummaryCard.fullName")}
              </FormLabel>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t("priceSummaryCard.fullNamePlaceholder")}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color="gray.700" fontSize="sm" mb={2}>
                {t("priceSummaryCard.email")}
              </FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("priceSummaryCard.emailPlaceholder")}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color="gray.700" fontSize="sm" mb={2}>
                {t("priceSummaryCard.phone")}
              </FormLabel>
              <Input
                type="tel"
                pattern="^\+374\d{8}$"
                value={phone}
                onChange={(e) => {
                  let sanitizedValue = e.target.value.replace(/\s+/g, "");
                  if (sanitizedValue.length > 12) {
                    sanitizedValue = sanitizedValue.slice(0, 12);
                  }
                  setPhone(sanitizedValue);
                }}
                placeholder={t("priceSummaryCard.phonePlaceholder")}
              />
            </FormControl>

            <Button type="submit" variant="solid-blue" mt={1} width="full" size="lg" isDisabled={!fullName || !email || !phone}>
              {t("priceSummaryCard.subscribeButton")}
            </Button>

            <Text textAlign="center" color="gray.500" fontSize="xs">
              {t("priceSummaryCard.subscribeDisclaimer")}
            </Text>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

