import React from "react";
import { Flex } from "@chakra-ui/react";
import { Checkbox, Icon, Tooltip } from "@/shared/ui";
import { useTranslation } from "react-i18next";

interface LateCheckoutSectionProps {
  lateCheckout: boolean;
  onLateCheckoutChange: (value: boolean) => void;
}

export const LateCheckoutSection: React.FC<LateCheckoutSectionProps> = ({
  lateCheckout,
  onLateCheckoutChange,
}) => {
  const { t } = useTranslation();

  return (
    <Checkbox
      size="lg"
      isChecked={lateCheckout}
      onChange={(e) => onLateCheckoutChange(e.target.checked)}
    >
      <Flex align="center">
        {t`lateCheckoutFromHotel`}

        <Tooltip label={t`availableSeatsTooltip`}>
          <Flex justify="center" align="center">
            <Icon name="info-outline" size="16" color="gray.800" ml="1" />
          </Flex>
        </Tooltip>
      </Flex>
    </Checkbox>
  );
};
