import { Box, Flex, Grid } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Button, Icon, Text } from "@ui";
import { numberWithCommaNormalizer } from "@/utils/normalizers.ts";
import { useBreakpoint } from "@shared/hooks";
import { useEffect, useState } from "react";
import { CURRENCY_MAP } from "@/shared/model";
import { formatNumber } from "@shared/utils";
import { CardSectionLayout } from "@/shared/ui/layout/CardSectionLayout.tsx";
import { useBookingDrawer } from "@/modules/packages/hooks/useBookingDrawer";
import { useUserContext } from "@/entities/user/index.ts";
import { useModalContext } from "@/app/providers/index.ts";
import { type PriceSummaryCardProps, type LayoutProps } from "./types.ts";
import { metaEvents } from "@/shared/configs/metaEvents";

export const PriceSummaryCard = ({
  tourPackage,
  containerRef,
  contentType = "hotel",
  ...props
}: PriceSummaryCardProps) => {
  const { t } = useTranslation();
  const { isMd } = useBreakpoint();

  const [isFixed, setIsFixed] = useState(false);
  const { user } = useUserContext();
  const { dispatchModal } = useModalContext();
  const { openBookingDrawer } = useBookingDrawer();

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef?.current && isMd) {
        const layoutTop = containerRef.current.getBoundingClientRect().top;

        if (layoutTop <= 40 && !isFixed) {
          setIsFixed(true);
        } else if (layoutTop > 40 && isFixed) {
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

  const handleBookClick = () => {
    if (tourPackage) {
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
        num_children:
          tourPackage.childrenTravelers + tourPackage.infantTravelers,
        room_type: "standard",
        booking_step: "personal_details",
      });
    }
    if (user?.id) {
      openBookingDrawer(tourPackage);
      return;
    }

    dispatchModal({
      type: "open",
      modalType: "auth",
      props: {
        view: "signUp",
        isCloseOnSuccess: true,
        onSuccess: () => {
          openBookingDrawer(tourPackage);
        },
      },
    });
  };

  return (
    <Layout isFixed={isFixed} {...props}>
      <CardSectionLayout
        px="4"
        gridArea="totalPrice"
        position={{
          base: "fixed",
          md: "static",
        }}
        bottom="0"
        left="0"
        right="0"
        width="full"
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
          {t`bookingDetails`}
        </Button>
      </CardSectionLayout>
    </Layout>
  );
};

export const Layout = ({ children, isFixed, ...props }: LayoutProps) => (
  <Box width={{ base: "full", md: "442px" }} {...props}>
    <Grid
      width={{ base: "full", md: "442px" }}
      borderY="1px solid"
      borderX={{
        base: "none",
        md: "1px solid",
      }}
      bgColor="white"
      borderTopColor="gray.100"
      borderLeftColor={{ base: "transparent", md: "gray.100" }}
      borderRightColor={{ base: "transparent", md: "gray.100" }}
      borderBottomColor="gray.100"
      rounded={{ base: "none", md: "md" }}
      height="fit-content"
      templateAreas={{
        base: `
        "availability"
        "config"
        "lateCheckout"
        "totalPrice"
        `,
        md: `
        "config"
        "availability"
        "lateCheckout"
        "totalPrice"
        `,
      }}
      gridTemplateRows="auto"
      gridTemplateColumns="1fr"
      position={isFixed ? "fixed" : "static"}
      top={isFixed ? "40px" : "auto"}
    >
      {children}
    </Grid>
  </Box>
);
