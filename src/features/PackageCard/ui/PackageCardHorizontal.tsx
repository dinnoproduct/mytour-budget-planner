import { Box, type LinkProps, Flex, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import ImageSlider from "./ImageSlider";
import { type ReactNode, useMemo } from "react";
import { LANGUAGE_PREFIX } from "@shared/model";
import { type Language } from "@widgets/Header/model";
import { Icon, StatusOnImageBadge, Text } from "@ui";
import { LanguageLink } from "../../../components/LanguageLink/LanguageLink";
import {
  type DictionaryTypes,
  type PackageCity,
  type PackageCountry,
  type PackageEntity,
  useDictionary,
} from "@entities/package";
import { getPluralForm } from "@shared/helpers";
import { type PackageCardHorizontalProps } from "./types";
import { PackageCardHorizontalDetail } from "./PackageCardHorizontalDetail";

export const PackageCardHorizontal = ({
  tourPackage = {},
  link,
  nights,
  ...props
}: PackageCardHorizontalProps) => {
  const { i18n, t } = useTranslation();

  const { data: foodTypes = [] } = useDictionary(
    "FoodTypeDictionary" as DictionaryTypes.FoodTypeDictionary,
  );

  const languageSuffix = useMemo(
    () => LANGUAGE_PREFIX[i18n.language as Language["name"]],
    [i18n.language],
  );

  const cityLabel = useMemo(
    () =>
      tourPackage.city[
        ("name" + languageSuffix) as keyof PackageCity
      ] as string,
    [tourPackage.city, languageSuffix],
  );

  const countryLabel = useMemo(
    () =>
      tourPackage.city.country[
        ("name" + languageSuffix) as keyof PackageCountry
      ] as string,
    [tourPackage.city.country, languageSuffix],
  );

  const packageName = useMemo(
    () =>
      tourPackage[("name" + languageSuffix) as keyof PackageEntity] as string,
    [tourPackage, languageSuffix],
  );

  const childrenTravelers = useMemo(() => {
    const childrenCount =
      tourPackage?.childrenTravelers + tourPackage?.infantTravelers;

    if (childrenCount === 0) return "";

    return `, ${childrenCount} ${t(getPluralForm(childrenCount, "children"))}`;
  }, [
    tourPackage?.childrenTravelers,
    tourPackage?.infantTravelers,
    languageSuffix,
  ]);

  const isHotelPackage = useMemo(
    () => !tourPackage.destinationFlight?.departureDate,
    [tourPackage.destinationFlight?.departureDate],
  );

  const foodType = foodTypes[tourPackage?.foodType]?.value;

  return (
    <Layout link={link} {...props}>
      <Flex flexDirection={{ base: "column", md: "row" }}>
        {/* hotel details layout */}
        <Flex
          gap={4}
          bgColor="gray.50"
          p={3}
          grow={1}
          flexDirection={{ base: "column", md: "row" }}
        >
          <Box width="326px">
            <ImageSlider
              images={tourPackage.hotel.images}
              starsCount={tourPackage.hotel.stars}
            />
          </Box>
          <VStack spacing={2} flexGrow={1} align="flex-start">
            <Text
              color="gray.800"
              size="md"
              fontWeight="bold"
              noOfLines={1}
              as="h3"
            >
              {packageName}
            </Text>
            {/* city and country */}
            <Flex alignItems="center" gap={1}>
              <Icon name="location-pin" color="gray.500" size="16" />
              <Text size="sm" color="gray.600">
                {cityLabel}, {countryLabel}
              </Text>
            </Flex>
            {/* breakfast */}
            {!!foodType && (
              <Flex alignItems="center" gap={1}>
                <Icon name="status-success-outlined" size="16" />
                <StatusOnImageBadge
                  status="foodType"
                  position="static"
                  backgroundColor="transparent"
                  p={0}
                  textProps={{
                    color: "gray.600",
                  }}
                  rounded="24px"
                >
                  {foodType}
                </StatusOnImageBadge>
              </Flex>
            )}
          </VStack>
        </Flex>
        {/*  */}
        <PackageCardHorizontalDetail
          tourPackage={tourPackage}
          nights={nights}
          isHotelPackage={isHotelPackage}
          childrenTravelers={childrenTravelers}
        />
      </Flex>
    </Layout>
  );
};

const Layout = ({
  children,
  link,
  ...props
}: {
  children: ReactNode | ReactNode[];
  link: string;
} & LinkProps) => {

  return (
    <LanguageLink
      to={link}
      _hover={{ textTransform: "none" }}
      maxWidth={{ base: "362px", md: "full" }}
      width={{ base: "auto", md: "full" }}
      target="_blank"
      {...props}
    >
      <Box
        width={{ base: "auto", md: "full" }}
        rounded="lg"
        overflow="hidden"
        border="1px solid"
        borderColor="gray.200"
        {...props}
      >
        {children}
      </Box>
    </LanguageLink>
  );
};
