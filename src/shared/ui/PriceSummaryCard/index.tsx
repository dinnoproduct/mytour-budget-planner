import {
  Flex,
  Box,
  useDisclosure,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Button, Icon, Text } from "@ui";
import { numberWithCommaNormalizer } from "@/utils/normalizers";
import { useBreakpoint } from "@shared/hooks";
import { useEffect, useMemo, useState } from "react";
import { CURRENCY_MAP } from "@/shared/model";
import { formatNumber } from "@shared/utils";
import { CardSectionLayout } from "@/shared/ui/layout/CardSectionLayout";
import { useBookingDrawer } from "@/modules/packages/hooks/useBookingDrawer";
import { type PriceSummaryCardProps } from "./types";
import { metaEvents } from "@/shared/configs/metaEvents";
import { getPluralForm } from "@/shared/helpers/getPluralForm";
import { SectionLayout } from "./SectionLayout";
import { DictionaryTypes, useDictionary } from "@entities/package";
import { useUserContext } from "@entities/user";
import { PriceSummaryCardLayout } from "./Layout";
import { SubscribeCTAButton } from "./SubscribeCTAButton";
import { SubscribeModal } from "./SubscribeModal";


export const PriceSummaryCard = ({
  tourPackage,
  containerRef,
  contentType = "hotel",
  ...props
}: PriceSummaryCardProps) => {
  const { t } = useTranslation();
  const { isMd } = useBreakpoint();
  const { user } = useUserContext();
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

  const [initialFromDate, initialToDate] = useMemo(() => {
    const rawFrom = isHotelContent
      ? tourPackage.checkin
      : (tourPackage.destinationFlight?.departureDate ?? tourPackage.checkin);
    const rawTo = isHotelContent
      ? tourPackage.checkout
      : (tourPackage.returnFlight?.departureDate ?? tourPackage.checkout);
    const from = rawFrom ? new Date(rawFrom) : null;
    const to = rawTo ? new Date(rawTo) : null;
    return [
      from && !Number.isNaN(from.getTime()) ? from : null,
      to && !Number.isNaN(to.getTime()) ? to : null,
    ] as const;
  }, [isHotelContent, tourPackage]);
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
      <PriceSummaryCardLayout isFixed={isFixed} {...props}>
        <CardSectionLayout
          px="4"
          gridArea="config"
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
          gridArea="totalPrice"
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
      </PriceSummaryCardLayout>

      <SubscribeModal
        isOpen={isOpen}
        onClose={onClose}
        initialFullName={[user?.firstName, user?.lastName].filter(Boolean).join(" ")}
        initialEmail={user?.email}
        initialPhone={user?.phoneNumber}
        contentType={contentType}
        initialFromDate={initialFromDate}
        initialToDate={initialToDate}
        subscriptionData={{
          hotelUrl: window.location.href,
          hotelId: String(tourPackage.hotel.id),
          cities: [tourPackage.city.id],
          adults: tourPackage.adultTravelers,
          childs: Array.from(
            { length: tourPackage.childrenTravelers },
            () => tourPackage.childMaxAge ?? 0,
          ),
        }}
      />
    </>
  );
};
