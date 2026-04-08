import {
  Box,
  Flex,
  Grid,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Button, Icon, Text } from "@ui";
import { numberWithCommaNormalizer } from "@/utils/normalizers.ts";
import { useBreakpoint } from "@shared/hooks";
import { useEffect, useState } from "react";
import { CURRENCY_MAP } from "@/shared/model";
import { formatNumber } from "@shared/utils";
import { CardSectionLayout } from "@/shared/ui/layout/CardSectionLayout.tsx";
import { useBookingDrawer } from "@/modules/packages/hooks/useBookingDrawer";
import { type PriceSummaryCardProps, type LayoutProps } from "./types.ts";
import { metaEvents } from "@/shared/configs/metaEvents";
import { PriceChangeSubscriptionForm } from "./PriceChangeSubscriptionForm";
import { getPluralForm } from "@/shared/helpers/getPluralForm.ts";
import { SectionLayout } from "./SectionLayout.tsx";
import { DictionaryTypes, useDictionary } from "@entities/package";


enum LayoutAreas {
  CONFIG = "config",
  AVAILABILITY = "availability",
  LATE_CHECKOUT = "lateCheckout",
  TOTAL_PRICE = "totalPrice",
  SUBSCRIBE_CTA = "subscribeCTA",
}

export const PriceSummaryCard = ({
  tourPackage,
  containerRef,
  contentType = "hotel",
  ...props
}: PriceSummaryCardProps) => {
  const { t } = useTranslation();
  const { isMd } = useBreakpoint();
  const { data: foodTypes = [] } = useDictionary(
    "FoodTypeDictionary" as DictionaryTypes.FoodTypeDictionary,
  );

  const [isFixed, setIsFixed] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { openBookingDrawer } = useBookingDrawer();

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef?.current && isMd) {
        const layoutTop = containerRef.current.getBoundingClientRect().top
        if (layoutTop <= 90 && !isFixed) {
          setIsFixed(true);
        } else if (layoutTop > 90 && isFixed) {
          setIsFixed(false);
        }
      }
    };

    if (!isMd) {
      setIsFixed(false);
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isFixed, isMd, containerRef?.current]);

  const handeInitiateCheckoutEventLog = () => {
    metaEvents.initiateCheckout({
      content_type: contentType,
      value: tourPackage.price,
      currency: "AMD",
      num_items: 1,
      hotel_id: tourPackage.hotel.id,
      hotel_name: tourPackage.hotel.name,
      destination:
        tourPackage.city.nameEng || tourPackage.city.nameArm || "Unknown",
      destination_country:
        tourPackage.city.country?.nameEng ||
        tourPackage.city.country?.nameArm ||
        "Unknown",
      checkin_date: tourPackage.checkin,
      checkout_date: tourPackage.checkout,
      num_nights: Math.ceil(
        (new Date(tourPackage.checkout).getTime() -
          new Date(tourPackage.checkin).getTime()) /
        (1000 * 60 * 60 * 24),
      ),
      num_adults: tourPackage.adultTravelers,
      num_children: tourPackage.childrenTravelers + tourPackage.infantTravelers,
      room_type: tourPackage.roomType,
    });
  };

  const handleBookClick = () => {
    handeInitiateCheckoutEventLog();
    openBookingDrawer();
  };

  const formatShortLocalizedDate = (rawDate?: string) => {
    if (!rawDate) return "";
    const date = new Date(rawDate);
    if (Number.isNaN(date.getTime())) return "";

    const longMonthName = date
      .toLocaleString("en-US", { month: "long" })
      .toLowerCase();
    const shortMonthName = t(`${longMonthName}Short`);
    return `${shortMonthName} ${date.getDate()}`;
  };

  const isHotelContent = contentType === "hotel";
  const durationDateRange = [
    formatShortLocalizedDate(
      isHotelContent
        ? tourPackage.checkin
        : (tourPackage.destinationFlight?.departureDate ?? tourPackage.checkin),
    ),
    formatShortLocalizedDate(
      isHotelContent
        ? tourPackage.checkout
        : (tourPackage.returnFlight?.departureDate ?? tourPackage.checkout),
    ),
  ]
    .filter(Boolean)
    .join(" - ");
  const mealTypeLabel =
    foodTypes.find(({ key }) => key === tourPackage.foodType)?.value ??
    String(tourPackage.foodType ?? "");

  return (
    <>
      <Layout isFixed={isFixed} {...props}>
        <CardSectionLayout
          px="4"
          gridArea={LayoutAreas.CONFIG}
          width="full"
          borderBottomRadius={{ base: "md !important", md: "0 !important" }}
          borderTopRadius={"md !important"}
        >
          <SectionLayout
            listItems={[
              { key: t`travelers`, value: `${tourPackage.adultTravelers} ${t`adult`}${tourPackage.childrenTravelers > 0 ? `, ${tourPackage.childrenTravelers} ${t(getPluralForm(tourPackage.childrenTravelers, 'children')).toLowerCase()}` : ''}` },
              { key: t`duration`, value: durationDateRange },
              { key: t`mealType`, value: mealTypeLabel }
            ]}
          />
        </CardSectionLayout>
        <CardSectionLayout
          px="4"
          gridArea={LayoutAreas.TOTAL_PRICE}
          position={{
            base: "fixed",
            md: "static",
          }}
          bottom="0"
          left="0"
          right="0"
          width="full"
          borderBottomRadius={"md !important"}
          borderTopRadius={{ base: "md !important", md: "0 !important" }}
        >
          <Flex width="full" justify="space-between" align="center" height="28px">
            <Text size="sm">{t`total`} :</Text>

            <Flex>
              <Text size="lg" fontWeight="bold" ml="2">
                {numberWithCommaNormalizer(tourPackage?.price)} ֏
              </Text>
              <Flex align="center" ml="2">
                {tourPackage ? (
                  <>
                    <Icon name="approximate" size="20" color="gray.500" />

                    <Text size="sm" color="gray.500" ml="0.5">
                      {CURRENCY_MAP[tourPackage.currency]}{" "}
                      {formatNumber(parseFloat(tourPackage.priceInCurrency))}
                    </Text>
                  </>
                ) : null}
              </Flex>
            </Flex>
          </Flex>
          <Button mt="4" width="full" onClick={handleBookClick} size="lg">
            {t`selectRoomAndMealType`}
          </Button>
        </CardSectionLayout>
        <SubscribeCTAButton onOpen={onOpen} />
      </Layout>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size={{ base: "full", md: "md" }} >
        <ModalOverlay />
        <ModalContent mx={{ base: 0, md: 4 }} sx={{ borderRadius: "2xl" }}>
          <ModalHeader bgColor="blue.500" p={4} sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <Text size="lg" fontWeight="bold" color="white" textAlign="left">
              {t("priceSummaryCard.subscribeModalTitle")}
            </Text>
            <Icon name="close" size="24" color="white" cursor="pointer" onClick={onClose} />
          </ModalHeader>
          <ModalBody p={0}>
            <PriceChangeSubscriptionForm />
          </ModalBody>
        </ModalContent>
      </Modal >
    </>
  );
};


const SubscribeCTAButton = ({ onOpen }: { onOpen: () => void }) => {
  const { t } = useTranslation();
  return (
    <Box
      gridArea={LayoutAreas.SUBSCRIBE_CTA}
      mt={{ base: 2, md: 6 }}
      width="full"
      bgColor="gray.700"
      color="white"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      cursor="pointer"
      transition="all 0.2s ease-in-out"
      _hover={{ bgColor: "gray.800" }}
      _active={{ bgColor: "gray.900" }}
      borderRadius={'lg'}
      p={4}
      onClick={onOpen}
    >
      <Flex display="flex" alignItems="center" gap={2}>
        <Box backgroundColor="green.500" borderRadius="full" display="flex" alignItems="center" p={1}>
          <Icon name="fluent-alert" size="16" color="white" />
        </Box>
        <Text size="sm" fontWeight={'semibold'} color="white">{t("priceSummaryCard.subscribeCTA")}</Text>
      </Flex>
      <Icon name="chevron-right" size="16" color="white" />
    </Box>
  );
};

export const Layout = ({ children, isFixed, ...props }: LayoutProps) => (
  <Box width={{ base: "full", md: "442px" }} {...props}>
    <Grid
      width={{ base: "full", md: "442px" }}
      height="auto"
      borderY="1px solid"
      borderX={{
        base: "none",
        md: "none",
      }}
      borderColor="transparent"
      rounded={{ base: "none", md: "md" }}
      templateAreas={{
        base: `
        "${LayoutAreas.AVAILABILITY}"
        "${LayoutAreas.CONFIG}"
        "${LayoutAreas.LATE_CHECKOUT}"
        "${LayoutAreas.TOTAL_PRICE}"
        "${LayoutAreas.SUBSCRIBE_CTA}"
        `,
        md: `
        "${LayoutAreas.CONFIG}"
        "${LayoutAreas.AVAILABILITY}"
        "${LayoutAreas.LATE_CHECKOUT}"
        "${LayoutAreas.TOTAL_PRICE}"
        "${LayoutAreas.SUBSCRIBE_CTA}"
        `,
      }}
      gridTemplateRows="auto"
      gridTemplateColumns="1fr"
      position={isFixed ? "fixed" : "static"}
      top={isFixed ? "90px" : "auto"}
    >
      {children}
    </Grid>
  </Box>
);
