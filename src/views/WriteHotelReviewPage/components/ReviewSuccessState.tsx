import { Box } from "@chakra-ui/react";
import { Button, Text } from "@ui";
import { useTranslation } from "react-i18next";

type ReviewSuccessStateProps = {
  onClose: () => void;
};

export const ReviewSuccessState = ({ onClose }: ReviewSuccessStateProps) => {
  const { t } = useTranslation();

  return (
    <Box border="1px solid" borderColor="green.200" bg="green.50" borderRadius="lg" p="4">
      <Text fontWeight="700" color="green.700">
        {t("reviewSuccessTitle")}
      </Text>
      <Text mt="2" size="sm" color="green.700">
        {t("reviewSuccessDescription")}
      </Text>
    </Box>
  );
};
