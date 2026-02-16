import React from "react";
import { Text, VStack, Box, Link } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Layout } from "../../Layout";
import usePolicy from "@/modules/packages/hooks/usePolicy";
import type { PackageEntity } from "@entities/package";

type PolicyType = "booking" | "cancellation";

interface PolicyModalProps {
  isOpen: boolean;
  handleClose: () => void;
  policyType?: PolicyType;
  packageDetails?: PackageEntity | null;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  handleClose,
  policyType = "booking",
  packageDetails,
}) => {
  const { t } = useTranslation();
  const { parsedPolicy, cancelationPolicyContent } = usePolicy(packageDetails);

  const title = policyType === "booking" ? t`bookingRules` : t`cancelRules`;
  const cancellationPolicyText = cancelationPolicyContent;

  return (
    <Layout isOpen={isOpen} closeModal={handleClose} title={title}>
      <VStack spacing={4} align="stretch">
        <Box my="6" mx="4">
          <Text fontSize="sm" color="gray.700">
            {policyType === "booking" ? (
              <>
                {parsedPolicy.before}{' '}
                {parsedPolicy.urlText && (
                  <Link
                    href={parsedPolicy.url}
                    target="_blank"
                    rel="noreferrer"
                    color="blue.500"
                    cursor="pointer"
                    textDecoration="underline"
                  >
                    {parsedPolicy.urlText}
                  </Link>
                )}
                {' '}{parsedPolicy.after}
              </>
            ) : (
              cancellationPolicyText
            )}
          </Text>
        </Box>
      </VStack>
    </Layout>
  );
};

// Keep the old name for backward compatibility
export const BookingRulesModal = PolicyModal;
