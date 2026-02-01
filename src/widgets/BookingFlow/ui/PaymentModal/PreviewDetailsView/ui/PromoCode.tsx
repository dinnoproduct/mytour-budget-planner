import type { PromoCodeProps } from "@widgets/BookingFlow/ui/PaymentModal/types";
import {Box, VStack} from "@chakra-ui/react";
import {Button, Input, Text} from "@ui";
import { useTranslation } from "react-i18next";
import { useState} from "react";
import {Switch} from "@/components/Switch";

export const PromoCode = ({
                            handleApplyPromoCode,
                            isApplyButtonDisabled,
                            promoCodeValue,
                            handlePromoCodeInputChange,
                            promoCodeError,
                            setHasPromoCode,
                            hasPromoCode,
                            promoCodeStatus,
                            ...props
                          }: PromoCodeProps) => {
  const { t } = useTranslation();

  return (
    <Box
      {...props}
      p="3"
      mt="4"
      border="1px solid"
      borderColor="gray.100"
      rounded="md"
      bg="white"
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text size="sm" fontWeight="semibold" color="gray.800">
          {t("usePromoCode")}
        </Text>

        <Switch
          isChecked={promoCodeStatus?.isApplied}
          isDisabled={promoCodeStatus?.isApplied}
          onChange={() => setHasPromoCode(!hasPromoCode)}/>
      </Box>

      {hasPromoCode && (
        <Box mt="3" display="flex" justifyContent="space-between" gap="2">
            <Box
              py="2"
              width="full"
            >
              <VStack spacing={2} align="stretch">
                <Input
                  width="full"
                  value={promoCodeValue || promoCodeStatus?.code}
                  onChange={(e) => handlePromoCodeInputChange(e.target.value)}
                  state={promoCodeError ? "invalid" : "default"}
                  placeholder={!promoCodeStatus?.isApplied ? t`promoCodePlaceholder`: promoCodeStatus?.code}
                  isDisabled={promoCodeStatus?.isApplied }
                />
                {promoCodeError && (
                  <Text color="red.500" fontSize="sm">
                    {promoCodeError}
                  </Text>
                )}
              </VStack>
            </Box>

            <Box py="2" borderColor="gray.100">
              <Button
                variant="solid-blue"
                size="lg"
                isDisabled={isApplyButtonDisabled || promoCodeStatus?.isApplied}
                onClick={handleApplyPromoCode}
              >
                {t("apply")}
              </Button>
            </Box>
        </Box>
      )}
    </Box>
  );
};
