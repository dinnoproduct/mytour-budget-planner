import { Box, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export const TermsAndConditionsSection = ({
  openBookingRulesModal,
  openCancellationPolicyModal,
}: {
  openBookingRulesModal: () => void;
  openCancellationPolicyModal: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <Box
      width="full"
      mt="4"
      mb="2"
    >
      <Text fontSize="xs" color="gray.600">
        {t`withContinueYouAccept`}{" "}
        <Text
          as="span"
          fontSize="xs"
          color="blue.500"
          cursor="pointer"
          textDecoration="underline"
          onClick={openBookingRulesModal}
        >
          {t`bookingAndPaymentTerms`}
        </Text>{" "}
        {t`and`}{" "}
        <Text
          as="span"
          fontSize="xs"
          color="blue.500"
          cursor="pointer"
          textDecoration="underline"
          onClick={openCancellationPolicyModal}
        >
          {t`cancelRules`}
        </Text>
        .
      </Text>
    </Box>
  );
};
