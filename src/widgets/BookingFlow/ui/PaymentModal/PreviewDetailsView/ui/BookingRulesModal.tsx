import React from "react";
import { Text, VStack, Box } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Layout } from "../../Layout";

interface BookingRulesModalProps {
  isOpen: boolean;
  handleClose: () => void;
}

export const BookingRulesModal: React.FC<BookingRulesModalProps> = ({
  isOpen,
  handleClose,
}) => {
  const { t } = useTranslation();

  return (
    <Layout isOpen={isOpen} closeModal={handleClose} title={t`bookingRules`}>
      <VStack spacing={4} align="stretch">
        <Box my="6" mx="4">
          <Text fontSize="sm" color="gray.700">
            If you make a booking at least 21 days before the flight, you need
            to pay 50% of the tour package price at the time of booking, and the
            remaining 50% is paid at least 15 days before the flight. If you
            book less than 21 days before the flight, you must pay 100% of the
            price of the tour package for booking, which will be then considered
            purchased.If the card payment is completed successfully, a request
            for booking confirmation will be sent to the travel agency for
            confirmation. Otherwise, the booking process should be started
            again. By submitting a booking request and accepting the package
            booking rules, you agree that any information on you and the
            travelers indicated in the booking application, that has been
            provided/become available via the intermediate company maintaining
            MyTour platform may become available/provided to the travel agency
            offering the package.By submitting a booking request and accepting
            the package booking rules, you agree to Sky Tour LLC {" "}
            <Text
              as="span"
              color="blue.500"
              cursor="pointer"
              textDecoration="underline"
              onClick={() => {
                // TODO: Open agreement terms modal/page
              }}
            >
              agreement terms.
            </Text>
          </Text>
        </Box>
      </VStack>
    </Layout>
  );
};
