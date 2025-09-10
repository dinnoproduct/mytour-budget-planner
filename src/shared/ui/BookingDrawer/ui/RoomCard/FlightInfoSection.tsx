import React from "react";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { Icon } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import moment from "moment";

interface FlightInfoSectionProps {
  airCompanyName: string;
  departureDate: string;
  returnDate: string;
}

export const FlightInfoSection: React.FC<FlightInfoSectionProps> = ({
  airCompanyName,
  departureDate,
  returnDate,
}) => {
  const { t } = useTranslation();

  // Format time only (HH:mm)
  const formatTime = (date: string) => {
    return moment(date).format("HH:mm");
  };

  return (
    <VStack spacing={3} align="stretch">
      {/* Airline */}
      <HStack spacing={2} align="center">
        <Text fontSize="xs" color="gray.900" fontWeight="medium">
          {t`airCompany`}
        </Text>
        <Box w="4px" h="4px" bg="gray.900" borderRadius="full" />
        <Text fontSize="xs" color="gray.900" fontWeight="medium">
          {airCompanyName}
        </Text>
      </HStack>

      {/* Flight times with visual elements */}
      <HStack spacing={1} align="center" w="full">
        <HStack spacing={2} align="center" flexShrink={0}>
          <Text fontSize="xs" color="gray.900" fontWeight="medium">
            {t`departure`}
          </Text>
          <Box w="4px" h="4px" bg="gray.900" borderRadius="full" />
          <Text fontSize="xs" color="gray.900" fontWeight="medium">
            {formatTime(departureDate)}
          </Text>
        </HStack>

        <HStack spacing={1.5} align="center" flex={1} justify="center" minW={0}>
          {/* Airplane icon pointing right */}
          <Icon name="departure" size="16" color="gray.500" flexShrink={0} />

          {/* Connecting line with dots */}
          <HStack spacing={0} align="center" flex={1} justify="center" minW={0}>
            <Box
              w="6px"
              h="6px"
              bg="gray.500"
              borderRadius="full"
              flexShrink={0}
            />
            <Box h="1px" bg="gray.500" flex={1} minW={0} />
            <Box
              w="6px"
              h="6px"
              bg="gray.500"
              borderRadius="full"
              flexShrink={0}
            />
          </HStack>

          {/* Airplane icon pointing left */}
          <Icon
            name="departure"
            size="16"
            color="gray.500"
            style={{ transform: "scaleX(-1)" }}
            flexShrink={0}
          />
        </HStack>

        <HStack spacing={2} align="center" flexShrink={0}>
          <Text fontSize="xs" color="gray.900" fontWeight="medium">
            {t`returning`}
          </Text>
          <Box w="4px" h="4px" bg="gray.900" borderRadius="full" />
          <Text fontSize="xs" color="gray.900" fontWeight="medium">
            {formatTime(returnDate)}
          </Text>
        </HStack>
      </HStack>
    </VStack>
  );
};
