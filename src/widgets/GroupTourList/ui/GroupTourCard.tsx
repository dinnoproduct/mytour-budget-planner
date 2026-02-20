import { Box, Flex, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import ImageSlider from "@features/PackageCard/ui/ImageSlider.tsx";
import { type ReactNode } from "react";
import { LANGUAGE_PREFIX } from "@shared/model";
import { type Language } from "@widgets/Header/model";
import { Icon, Text } from "@ui";
import { LanguageLink } from "@/components/LanguageLink/LanguageLink";
import { type GroupTourEntity } from "@entities/package";
import { formatNumber } from "@shared/utils";
import moment from "moment";
import { useMemo } from "react";

type GroupTourCardProps = {
  groupTour: GroupTourEntity;
  link?: string;
};

export const GroupTourCard = ({ groupTour, link = "#" }: GroupTourCardProps) => {
  const { i18n, t } = useTranslation();

  const languageSuffix = useMemo(
    () => LANGUAGE_PREFIX[i18n.language as Language["name"]],
    [i18n.language],
  );

  const groupName = useMemo(
    () => groupTour.name[languageSuffix as keyof typeof groupTour.name] || groupTour.name.eng,
    [groupTour.name, languageSuffix],
  );

  // Convert gallery to image format expected by ImageSlider
  const images = useMemo(
    () =>
      groupTour.gallery
        .sort((a, b) => a.order - b.order)
        .map((item) => ({
          url: item.url,
          size: 3, // Default size for horizontal cards
        })),
    [groupTour.gallery],
  );

  // Get the first available departure for display
  const firstDeparture = useMemo(
    () =>
      groupTour.departures
        .filter((dep) => dep.availableSeats > 0)
        .sort((a, b) => moment(a.startDate).valueOf() - moment(b.startDate).valueOf())[0] ||
      groupTour.departures[0],
    [groupTour.departures],
  );

  const duration = firstDeparture?.duration || 0;
  const startDate = firstDeparture?.startDate
    ? moment(firstDeparture.startDate).format("DD MMM YYYY")
    : "";
  const endDate = firstDeparture?.endDate
    ? moment(firstDeparture.endDate).format("DD MMM YYYY")
    : "";

  return (
    <LanguageLink
      to={link}
      _hover={{ textTransform: "none" }}
    >
      <Box
        maxWidth="full"
        width="full"
        rounded="lg"
        overflow="hidden"
        border="1px solid"
        borderColor="gray.200"
        bg="white"
      >
        <Flex flexDirection={{ base: "column", md: "row" }}>
          {/* Image section */}
          <Flex
            gap={4}
            bgColor="gray.50"
            p={3}
            grow={1}
            flexDirection={{ base: "column", md: "row" }}
          >
            <Box width={{ base: "full", md: "326px" }}>
              {images.length > 0 ? (
                <ImageSlider
                  images={images}
                  starsCount={0}
                />
              ) : (
                <Box
                  width="full"
                  height="170px"
                  bg="gray.200"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text color="gray.400">No Image</Text>
                </Box>
              )}
            </Box>
            <VStack spacing={2} flexGrow={1} align="flex-start">
              <Text
                color="gray.800"
                size="md"
                fontWeight="bold"
                noOfLines={2}
                as="h3"
              >
                {groupName}
              </Text>
              {firstDeparture && (
                <>
                  <Flex alignItems="center" gap={1}>
                    <Icon name="calendar" color="gray.500" size="16" />
                    <Text size="sm" color="gray.600">
                      {startDate} - {endDate}
                    </Text>
                  </Flex>
                  {duration > 0 && (
                    <Flex alignItems="center" gap={1}>
                      <Icon name="clock" color="gray.500" size="16" />
                      <Text size="sm" color="gray.600">
                        {duration} {t("days")}
                      </Text>
                    </Flex>
                  )}
                  <Flex alignItems="center" gap={1}>
                    <Icon name="users" color="gray.500" size="16" />
                    <Text size="sm" color="gray.600">
                      {t("availableSeats", { count: firstDeparture.availableSeats })}
                    </Text>
                  </Flex>
                </>
              )}
            </VStack>
          </Flex>
          {/* Price section */}
          <Box
            p={4}
            minW={{ base: "full", md: "200px" }}
            bg="white"
            borderLeft={{ base: "none", md: "1px solid" }}
            borderTop={{ base: "1px solid", md: "none" }}
            borderColor="gray.200"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <VStack spacing={2} align="flex-start">
              <Text size="sm" color="gray.600">
                {t("priceFrom")}
              </Text>
              <Text size="xl" fontWeight="bold" color="gray.800">
                {formatNumber(groupTour.price)} {groupTour.currency}
              </Text>
              {groupTour.rate && (
                <Text size="sm" color="gray.600">
                  ≈ {formatNumber(groupTour.price * groupTour.rate)} ֏
                </Text>
              )}
            </VStack>
          </Box>
        </Flex>
      </Box>
    </LanguageLink>
  );
};
