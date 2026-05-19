import {
  Box,
  Flex,
  HStack,
  ListItem,
  Portal,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { Button, Heading, HotelStarBadge, Input, Text } from "@ui";
import { StepBottomActions } from "@widgets/BookingFlow/ui/StepBottomActions";
import { useTranslation } from "react-i18next";
import {
  type PreviewDetailsViewProps,
  type SectionLayoutProps,
  type SectionListProps,
  type ListItem as ListItemType,
} from "../types";
import { useRecoilValue } from "recoil";
import { isLateCheckoutAtom } from "@/modules/packages/store/store";
import { formatNumber } from "@shared/utils";
import { LANGUAGE_PREFIX, type LanguageName } from "@shared/model";
import { useMemo, useState, useEffect } from "react";
import {
  type DictionaryTypes,
  type PackageEntity,
  useDictionary,
} from "@entities/package";
import { Icon, type IconName } from "@foundation/Iconography";
import moment from "moment";
import { TermsAndConditionsSection } from "./ui/TermsAndConditionsSection";
import { BookingRulesModal } from "./ui/BookingRulesModal";
import { PromoCode } from "./ui/PromoCode";

const formatDate = (date: string, includeTime = false) => {
  if (!date) {
    return "";
  }

  return moment(date).format(includeTime ? "DD.MM.YYYY HH:mm" : "DD.MM.YYYY");
};

export const PreviewDetailsView = ({
  onPay,
  onUsePromocode,
  isLoadingBooking,
  packageDetails,
  travelers,
  paymentAmount,
  isFullPricePayment,
  prepaymentInfo,
  validatePromoCode,
  promoCodeStatus,
  setPromoCodeStatus,
  paymentOption = "pay",
  onBackClick,
  renderAsPage = false,
  isLateCheckout: isLateCheckoutProp,
  onPromoDiscountedPriceChange,
}: PreviewDetailsViewProps) => {
  const { t, i18n } = useTranslation();
  const [promoCodeValue, setPromoCodeValue] = useState("");
  const [hasPromoCode, setHasPromoCode] = useState(promoCodeStatus.isApplied);
  const [promoCodeErrorCode, setPromoCodeErrorCode] = useState<string | null>(null);
  const [isBookingRulesModalOpen, setIsBookingRulesModalOpen] = useState(false);
  const [isCancellationPolicyModalOpen, setIsCancellationPolicyModalOpen] =
    useState(false);
  const [policyModalType, setPolicyModalType] = useState<
    "booking" | "cancellation"
  >("booking");
  const atomLateCheckout = useRecoilValue(isLateCheckoutAtom);
  const isLateCheckout =
    typeof isLateCheckoutProp === "boolean"
      ? isLateCheckoutProp
      : typeof packageDetails?.lateCheckout === "boolean"
        ? packageDetails.lateCheckout
        : atomLateCheckout;
  // Reset promo code status when payment option changes to "noPrepayment"
  useEffect(() => {
    if (paymentOption === "noPrepayment" && promoCodeStatus.isApplied) {
      setPromoCodeStatus({
        isApplied: false,
        code: "",
        discount: 0,
        finalAmount: 0,
        firstPayment: 0,
        secondPayment: 0,
        skipPayment: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentOption]);

  const handleUsePromocode = () => {
    onUsePromocode();
  };

  const handleRemovePromoCode = () => {
    setPromoCodeStatus({
      isApplied: false,
      code: "",
      discount: 0,
      finalAmount: 0,
      firstPayment: 0,
      secondPayment: 0,
      skipPayment: false,
    });
    setHasPromoCode(false);
    setPromoCodeValue("");
    setPromoCodeErrorCode(null);
    onPromoDiscountedPriceChange?.(null);
  };

  const handlePromoCodeInputChange = (value: string) => {
    setPromoCodeValue(value);
    // Clear error when user starts typing
    if (promoCodeErrorCode) {
      setPromoCodeErrorCode(null);
    }
  };

  const handleApplyPromoCode = () => {
    if (isApplyButtonDisabled) return;

    if (isGroupTourPackage) return; // Promo validation uses hotel/city; skip for group tours
    const city = (packageDetails as any).city;
    const hotel = (packageDetails as any).hotel;
    validatePromoCode.mutate(
      {
        promoCode: promoCodeValue.trim(),
        price: packageDetails.price,
        agencyId: packageDetails.travelAgency.id,
        destinationId: city?.id,
        hotelId: hotel?.id,
        startDate: packageDetails.checkin,
        bookingType: prepaymentInfo?.bookingType,
        prePaymentAmount: paymentAmount
      },
      {
        onSuccess: (data: any) => {
          if (data.success && data.isValid) {
            setPromoCodeStatus({
              isApplied: true,
              code: promoCodeValue.trim(),
              discount: data.discount,
              finalAmount: data.finalAmount,
              firstPayment: data.firstPayment,
              secondPayment: data.secondPayment,
              skipPayment: data.skipPayment,
            });
            onPromoDiscountedPriceChange?.(data.finalAmount);
          } else {
            console.log(`Promo code error: ${data.message}`);

            setPromoCodeErrorCode(data.errorCode || "INVALID_CODE");
          }
        },
        onError: (error: any) => {
          console.error("Failed to validate promo code:", error);
          setPromoCodeErrorCode("VALIDATION_FAILED");
        },
      },
    );
  };

  const isApplyButtonDisabled = promoCodeValue.trim().length < 3;

  const promoCodeErrorMessages = useMemo<Record<string, string>>(() => {
    return {
      "Invalid-Expired-Code": t`promoCodeInvalid`,
      "Usage-Limit-Reached": t`promoCodeExpired`,
      "Minimum-Value-Not-Met": t`promoCodeMinimumValue`,
      "Scope-Mismatch": t`promoCodeScopeMismatch`,
      "New-User-Code-by-Existing-User": t`promoCodeNewUserOnly`,
      INVALID_CODE: t`promoCodeInvalid`,
      VALIDATION_FAILED: t`promoCodeValidationFailed`,
    };
  }, [t]);

  const promoCodeError = promoCodeErrorCode
    ? (promoCodeErrorMessages[promoCodeErrorCode] ?? t`promoCodeInvalid`)
    : null;

  const calculatePromoCodePayments = useMemo(() => {
    if (!promoCodeStatus.isApplied) {
      return {
        firstPayment: paymentAmount || 0,
        secondPayment: isFullPricePayment ? 0 : (packageDetails.price - (paymentAmount || 0)),
        isSinglePayment: isFullPricePayment,
      };
    }

    // Use backend calculation for promo scenarios.
    const firstPayment = promoCodeStatus.firstPayment ?? 0;
    const secondPayment = promoCodeStatus.secondPayment ?? 0;
    return {
      firstPayment,
      secondPayment,
      isSinglePayment: promoCodeStatus.skipPayment || secondPayment <= 0,
    };
  }, [
    promoCodeStatus.isApplied,
    promoCodeStatus.firstPayment,
    promoCodeStatus.secondPayment,
    promoCodeStatus.skipPayment,
    paymentAmount,
    packageDetails.price,
    isFullPricePayment,
  ]);

  // Old price display rule: when promo is applied, always show full package price.
  const promoCompareAmount = useMemo(
    () => (promoCodeStatus.isApplied ? packageDetails.price : packageDetails.price),
    [
      promoCodeStatus.isApplied,
      packageDetails.price,
    ],
  );

  const footerDisplayAmount = useMemo(() => {
    if (!promoCodeStatus.isApplied) {
      return paymentAmount || 0;
    }

    const isPromoCoveringFullPrice =
      promoCodeStatus.skipPayment || (promoCodeStatus.finalAmount ?? 0) <= 0;

    if (isPromoCoveringFullPrice) {
      // In partial payment flow, full promo coverage means user pays 0 now.
      if (!isFullPricePayment) {
        return 0;
      }
      return packageDetails.price;
    }

    return calculatePromoCodePayments.firstPayment;
  }, [
    promoCodeStatus.isApplied,
    promoCodeStatus.skipPayment,
    promoCodeStatus.finalAmount,
    paymentAmount,
    packageDetails.price,
    isFullPricePayment,
    calculatePromoCodePayments.firstPayment,
  ]);

  const footerCompareAmount = useMemo(() => {
    if (!promoCodeStatus.isApplied) {
      return packageDetails.price;
    }

    const isPromoCoveringFullPrice =
      promoCodeStatus.skipPayment || (promoCodeStatus.finalAmount ?? 0) <= 0;

    if (isPromoCoveringFullPrice) {
      return packageDetails.price;
    }

    // For partial payment with promo not fully covering full price,
    // compare against the original partial amount user came with.
    return paymentAmount || 0;
  }, [
    promoCodeStatus.isApplied,
    promoCodeStatus.skipPayment,
    promoCodeStatus.finalAmount,
    packageDetails.price,
    paymentAmount,
  ]);

  const paymentDetailsItems = useMemo((): ListItemType[] => {
    const currentPaymentAmount = calculatePromoCodePayments.firstPayment;

    const items: ListItemType[] = [
      {
        key: t`price`,
        value: formatNumber(promoCompareAmount) + "֏",
        isStrikethrough: promoCodeStatus.isApplied,
      },
    ];

    if (promoCodeStatus.isApplied) {
      items.push({
        key: t`discount`,
        value: `-${formatNumber(promoCodeStatus.discount)}֏`,
        isStrikethrough: false,
        isDiscount: true,
      });
      items.push({
        key: t`finalPrice`,
        value: formatNumber(promoCodeStatus.finalAmount) + "֏",
        isStrikethrough: false,
        isHighlighted: true,
      });
    }

    items.push({
      key: t`amountToBePaid`,
      value: formatNumber(currentPaymentAmount) + "֏",
      isStrikethrough: false,
    });

    // Show balance only if it's not a single payment (split payment scenario)
    if (!isFullPricePayment && !calculatePromoCodePayments.isSinglePayment) {
      const remainingAmount = calculatePromoCodePayments.secondPayment;
      const nextPaymentDate =
        prepaymentInfo?.secondPaymentDate ?? prepaymentInfo?.firstPaymentDate ?? "";

      items.push({
        key: t`balance`,
        value: formatNumber(remainingAmount) + "֏",
        isStrikethrough: false,
      });
      items.push({
        key: t`nextPaymentDate`,
        value: formatDate(nextPaymentDate),
        isStrikethrough: false,
      });
    }

    return items;
  }, [
    isFullPricePayment,
    promoCompareAmount,
    promoCodeStatus,
    calculatePromoCodePayments,
    prepaymentInfo?.firstPaymentDate,
    prepaymentInfo?.secondPaymentDate,
    t,
  ]);

  const isGroupTourPackage = useMemo(
    () =>
      !!(
        packageDetails &&
        !(packageDetails as any).hotel &&
        (packageDetails as any).departures &&
        (packageDetails as any).agency
      ),
    [packageDetails],
  );

  const countryName = useMemo(() => {
    const country = packageDetails?.city?.country;
    if (!country) return "";
    const key =
      `name${LANGUAGE_PREFIX[i18n.language as LanguageName]}` as keyof PackageEntity["city"]["country"];
    return (country[key] as string) || "";
  }, [i18n.language, packageDetails?.city?.country]);

  const cityName = useMemo(() => {
    const city = packageDetails?.city;
    if (!city) return "";
    const key =
      `name${LANGUAGE_PREFIX[i18n.language as LanguageName]}` as keyof PackageEntity["city"];
    return (city[key] as string) || "";
  }, [i18n.language, packageDetails?.city]);

  const displayTitle = useMemo(() => {
    const pd = packageDetails as any;
    if (isGroupTourPackage && pd?.name) {
      const suffix = LANGUAGE_PREFIX[i18n.language as LanguageName] ?? "Eng";
      const key = suffix.toLowerCase() as "eng" | "arm" | "rus";
      return pd.name[key] ?? pd.name.eng ?? pd.name.arm ?? "";
    }
    return pd?.nameEng ?? "";
  }, [packageDetails, isGroupTourPackage, i18n.language]);

  const displaySubtitle = useMemo(() => {
    const pd = packageDetails as any;
    if (isGroupTourPackage) {
      return pd?.agency?.name ?? "";
    }
    return null;
  }, [packageDetails, isGroupTourPackage]);

  const groupTourRoomTypeLabel = useMemo(() => {
    const pd = packageDetails as any;
    if (!isGroupTourPackage || pd?.roomType == null) return "";
    const room = (pd.roomTypes ?? []).find(
      (r: any) => Number(r.id) === Number(pd.roomType)
    );
    if (!room?.name) return "";
    const suffix = LANGUAGE_PREFIX[i18n.language as LanguageName] ?? "Eng";
    const key = suffix.toLowerCase() as "eng" | "arm" | "rus";
    return room.name[key] ?? room.name.eng ?? room.name.arm ?? "";
  }, [packageDetails, isGroupTourPackage, i18n.language]);

  const groupTourRouteSummary = useMemo(() => {
    const pd = packageDetails as any;
    if (!isGroupTourPackage || !pd?.routeSummary) return "";
    const suffix = LANGUAGE_PREFIX[i18n.language as LanguageName] ?? "Eng";
    const key = suffix.toLowerCase() as "eng" | "arm" | "rus";
    return pd.routeSummary[key] ?? pd.routeSummary.eng ?? pd.routeSummary.arm ?? "";
  }, [packageDetails, isGroupTourPackage, i18n.language]);

  const groupTourRouteCountriesList = useMemo(() => {
    const pd = packageDetails as any;
    if (!isGroupTourPackage || !Array.isArray(pd?.routeCountries) || pd.routeCountries.length === 0)
      return [];
    const suffix = LANGUAGE_PREFIX[i18n.language as LanguageName] ?? "Eng";
    const key = suffix.toLowerCase() as "eng" | "arm" | "rus";
    return pd.routeCountries.map(
      (item: any) => item[key] ?? item.eng ?? item.arm ?? ""
    ).filter(Boolean);
  }, [packageDetails, isGroupTourPackage, i18n.language]);

  const groupTourDuration = useMemo(() => {
    const pd = packageDetails as any;
    if (!isGroupTourPackage || !pd?.departures?.length) return null;
    const d = pd.departures[0];
    return d?.duration != null ? d.duration : null;
  }, [packageDetails, isGroupTourPackage]);

  const isHotelPackage = useMemo(
    () =>
      !(
        packageDetails?.destinationFlight?.id && packageDetails?.returnFlight.id
      ),
    [packageDetails?.destinationFlight?.id, packageDetails?.returnFlight?.id],
  );
  const { data: foodTypes = [] } = useDictionary(
    "FoodTypeDictionary" as DictionaryTypes.FoodTypeDictionary,
  );

  const { data: roomTypes = [] } = useDictionary(
    "RoomTypeDictionary" as DictionaryTypes.RoomTypeDictionary,
  );

  const foodType = useMemo<string>(
    () =>
      foodTypes.find(({ key }: any) => key === packageDetails.foodType)
        ?.value || "",
    [JSON.stringify(foodTypes)],
  );

  const summaryCards = useMemo(() => {
    const cards = isHotelPackage || isGroupTourPackage
      ? []
      : ([
        (packageDetails as any).hotel?.id ? (
          <SummaryCard key="hotel" iconName="bed" children={t`hotel`} />
        ) : null,
        (packageDetails as any).destinationFlight?.id &&
          (packageDetails as any).returnFlight?.id ? (
          <SummaryCard
            key="flight"
            iconName="airplanemode-active"
            children={t`airTicket`}
          />
        ) : null,
        packageDetails.foodType ? (
          <SummaryCard key="food" iconName="restaurant" children={foodType} />
        ) : null,
        packageDetails.transferType ? (
          <SummaryCard
            key="transfer"
            iconName="directions-car"
            children={t`transportation`}
          />
        ) : null,
      ].filter(Boolean) as React.ReactNode[]);

    const chunkedCards = [];

    for (let i = 0; i < cards.length; i += 2) {
      chunkedCards.push(cards.slice(i, i + 2));
    }

    return chunkedCards;
  }, [packageDetails, foodType, t, isHotelPackage, isGroupTourPackage]);

  return (
    <>
      <Flex
        direction="column"
        justify="space-between"
        width="full"
        {...(renderAsPage ? {} : { height: "full", maxH: { base: "calc(100dvh - 82px)", md: "none" } })}
      >
        <Box
          flex="1"
          py="4"
          overflowY={renderAsPage ? { base: "visible", md: "visible" } : { base: "auto", md: "visible" }}
          overflowX="hidden"
          {...(renderAsPage
            ? {}
            : { height: { base: "calc(100% - 174px)", md: "auto" }, minH: 0 })}
          pb={{
            base: 4,
            md: 4,
          }}
          mb={{ base: renderAsPage ? "180px" : '80px', md: 0 }}
        >
          <Flex direction="column">
            <Flex align="center" justify="space-between">
              <Heading
                as="h3"
                size="sm-sm"
                color="gray.800"
                display="inline-block"
              >
                {displayTitle}
              </Heading>

              {packageDetails?.hotel?.stars != null && (
                <HotelStarBadge starsCount={packageDetails.hotel.stars} ml="2" />
              )}
            </Flex>

            {(displaySubtitle || countryName || cityName) && (
              <Text
                size={{ base: "sm", md: "md" }}
                color="gray.800"
                mt="2"
                fontWeight="medium"
              >
                {displaySubtitle != null && displaySubtitle !== ""
                  ? displaySubtitle
                  : [countryName, cityName].filter(Boolean).join(", ")}
              </Text>
            )}
          </Flex>

          <SectionLayout mt="6" listItems={paymentDetailsItems} />

          {isGroupTourPackage && (groupTourRouteSummary || groupTourRouteCountriesList.length > 0) && (
            <SectionLayout
              mt="4"
              title={t("route")}
              listItems={[
                ...(groupTourRouteCountriesList.length > 0
                  ? [{ key: t("countries") || "Countries", value: groupTourRouteCountriesList.join(", "), isStrikethrough: false, isNewLine: true, isBorderless: true }]
                  : []),
                ...(groupTourRouteSummary
                  ? [{ key: t("routeSummary") || "Route summary", value: <Box dangerouslySetInnerHTML={{ __html: groupTourRouteSummary }} />, isStrikethrough: false, isNewLine: true, isBorderless: true }]
                  : []),
              ].filter((item: ListItemType) => !!item.value) as ListItemType[]}
            />
          )}

          {!isHotelPackage && (
            <SectionLayout title={t`included`} mt="4">
              <VStack spacing="16px" align="stretch">
                {summaryCards.map((row, index) => (
                  <Flex key={index} gap="16px">
                    {row}
                  </Flex>
                ))}
              </VStack>
            </SectionLayout>
          )}

          {travelers && (
            <SectionLayout
              mt="4"
              title={t`travelers`}
              listItems={[
                ...travelers.adults.map((traveler) => ({
                  key: traveler.firstName + " " + traveler.lastName,
                  value: formatDate(traveler.dateOfBirth),
                })),
                ...travelers.children.map((traveler) => ({
                  key: traveler.firstName + " " + traveler.lastName,
                  value: formatDate(traveler.dateOfBirth),
                })),
              ]}
            />
          )}

          {!isHotelPackage && (
            <SectionLayout
              mt="4"
              title={t`flightDetails`}
              listItems={[
                {
                  key: t`departure`,
                  value: formatDate(
                    (packageDetails as any).destinationFlight?.departureDate ?? "",
                    true,
                  ),
                },
                {
                  key: t`returning`,
                  value: formatDate(
                    (packageDetails as any).returnFlight?.departureDate ?? "",
                    true,
                  ),
                },
              ]}
            />
          )}

          <SectionLayout
            mt="4"
            title={isGroupTourPackage ? (t("tripDetails") || t`hotelDetails`) : t`hotelDetails`}
            listItems={[
              ...(packageDetails?.roomType != null || (isGroupTourPackage && (packageDetails as any).roomType != null)
                ? [{
                  key: t`room`,
                  value: isGroupTourPackage && groupTourRoomTypeLabel
                    ? groupTourRoomTypeLabel
                    : roomTypes.find(
                      ({ key }: any) => Number(key) === Number((packageDetails as any).roomType),
                    )?.value || "",
                }]
                : []),
              {
                key: isGroupTourPackage ? t("departure") : t`checkIn`,
                value: formatDate((packageDetails as any).checkin ?? "", !isGroupTourPackage),
              },
              {
                key: isGroupTourPackage ? t("returning") : t`checkOut`,
                value: formatDate((packageDetails as any).checkout ?? "", !isGroupTourPackage),
              },
              ...(!isHotelPackage
                ? [
                  {
                    key: t`lateCheckOut`,
                    value: isLateCheckout ? t`included` : t`notIncluded`,
                  },
                ]
                : []),
            ]}
          />
          {/* PromoCode Section (not available for group tours) */}
          {!isGroupTourPackage && paymentOption !== "noPrepayment" && (
            <PromoCode
              isApplyButtonDisabled={isApplyButtonDisabled}
              handleApplyPromoCode={handleApplyPromoCode}
              handlePromoCodeInputChange={handlePromoCodeInputChange}
              promoCodeValue={promoCodeValue}
              promoCodeError={promoCodeError}
              hasPromoCode={hasPromoCode}
              setHasPromoCode={setHasPromoCode}
              promoCodeStatus={promoCodeStatus}
              onRemovePromo={handleRemovePromoCode}
            />
          )}

          {/* Terms and Conditions Section */}
          <TermsAndConditionsSection
            openBookingRulesModal={() => {
              setPolicyModalType("booking");
              setIsBookingRulesModalOpen(true);
            }}
            openCancellationPolicyModal={() => {
              setPolicyModalType("cancellation");
              setIsCancellationPolicyModalOpen(true);
            }}
          />
        </Box>

        <Box
          px={{ base: "4", md: "0" }}
          py="4"
          width="full"
          borderTop={{ base: "1px solid", md: "none" }}
          borderColor={{ base: "gray.100", md: "transparent" }}
          backgroundColor="white"
          mt="auto"
          position={{ base: 'fixed', md: 'relative' }}
          bottom={{ base: 0, md: 'auto' }}
          left={{ base: 0, md: 'auto' }}
          right={{ base: 0, md: 'auto' }}
          zIndex={{ base: 10, md: undefined }}
        >
          <Flex justify="space-between" align="center">
            <Text size="md" fontWeight="medium" color="gray.600">
              {t("total")}
            </Text>
            <Flex align="center" gap="2">
              {promoCodeStatus.isApplied && (
                <Text
                  size="xs"
                  fontWeight="medium"
                  textDecoration="line-through"
                  color="red.400"
                >
                  {formatNumber(footerCompareAmount)}֏
                </Text>
              )}
              <Text size="md" fontWeight="bold" color="black">
                {formatNumber(footerDisplayAmount) + "֏"}
              </Text>
            </Flex>
          </Flex>
          {renderAsPage && onBackClick ? (
            <StepBottomActions
              inline
              isLoadingBooking={isLoadingBooking}
              stickyOnMobile
              onBack={onBackClick}
              backLabel={t`back`}
              primaryButton={
                <Button
                  variant="solid-blue"
                  width="full"
                  onClick={onPay}
                  isLoading={isLoadingBooking}
                  size="lg"
                >
                  {paymentOption === "noPrepayment" || (promoCodeStatus.isApplied && calculatePromoCodePayments.firstPayment === 0) ? t("reserve") : t("selectPaymentMethod")}
                </Button>
              }
            />
          ) : (
            <Button
              variant="solid-blue"
              width="full"
              mt="3"
              onClick={onPay}
              isLoading={isLoadingBooking}
              size="lg"
            >
              {paymentOption === "noPrepayment" || (promoCodeStatus.isApplied && calculatePromoCodePayments.firstPayment === 0) ? t("reserve") : t("reserve")}
            </Button>
          )}
        </Box>
      </Flex>

      {/*<Portal>*/}
      {/*</Portal>*/}
      <Portal>
        <BookingRulesModal
          isOpen={isBookingRulesModalOpen || isCancellationPolicyModalOpen}
          handleClose={() => {
            setIsBookingRulesModalOpen(false);
            setIsCancellationPolicyModalOpen(false);
          }}
          policyType={policyModalType}
          packageDetails={packageDetails}
        />
      </Portal>
    </>
  );
};

const SectionLayout = ({
  children,
  title,
  subtitle,
  listItems,
  ...props
}: SectionLayoutProps) => (
  <Box
    {...props}
    p="3"
    border="1px solid"
    borderColor="gray.100"
    rounded="md"
    bg="white"
  >
    {title && (
      <Text size="sm" fontWeight="semibold" color="gray.800" mb="4">
        {title}
      </Text>
    )}

    <Box>
      {children}

      {listItems?.length ? <SectionList listItems={listItems} mt={4} /> : null}
    </Box>
  </Box>
);


const SectionList = ({ listItems, ...props }: SectionListProps) => (
  <UnorderedList
    {...props}
    listStyleType="none"
    mx="0"
    width="full"
    spacing="4"
    mt="0"
  >
    {listItems.map(
      (
        { key, value, isStrikethrough, isDiscount, isHighlighted, isNewLine, isBorderless }: any,
        index: number,
      ) => (
        <ListItem key={index} as={HStack} flexDirection={isNewLine ? "column" : "row"} alignItems={isNewLine ? "flex-start" : "center"} spacing="2" width="full">
          <Text fontWeight={isNewLine ? "semibold" : "normal"} size="sm" flexShrink={0}>
            {key}
          </Text>

          {value && !isNewLine && (
            <>
              <Box
                backgroundImage={isBorderless ? "none" : "/assets/images/border.svg"}
                height="2px"
                flexGrow={1}
                backgroundRepeat="repeat-x"
                borderRadius="full"
                mt={isBorderless ? "0" : "0.5"}
                minW="100px"
              />
              <Text
                textAlign="right"
                fontWeight="semibold"
                size="sm"
                textDecoration={isStrikethrough ? "line-through" : "none"}
                color={
                  isDiscount
                    ? "red.500"
                    : isHighlighted
                      ? "green.600"
                      : isStrikethrough
                        ? "gray.500"
                        : "inherit"
                }
              >
                {value}
              </Text>
            </>
          )}
          {value && isNewLine && (
            <Text
              textAlign="left"
              fontWeight="normal"
              size="sm"
              sx={{
                '& p': { color: 'gray.800', fontSize: 'sm', lineHeight: 'sm', fontWeight: '500' },
                '& strong': { fontSize: 'sm', lineHeight: 'sm', fontWeight: '500', color: 'gray.800', },
              }}
              textDecoration={isStrikethrough ? "line-through" : "none"}
              color={
                isDiscount
                  ? "red.500"
                  : isHighlighted
                    ? "green.600"
                    : isStrikethrough
                      ? "gray.500"
                      : "inherit"
              }
            >
              {value}
            </Text>
          )}
        </ListItem>
      ),
    )}
  </UnorderedList>
);

const SummaryCard = ({
  iconName,
  children,
}: {
  iconName: IconName;
  children: string;
}) => (
  <HStack spacing="2" align="center">
    <Flex
      bgColor="gray.100"
      rounded="base"
      width="28px"
      height="28px"
      align="center"
      justify="center"
    >
      <Icon name={iconName} size="20" color="gray.500" />
    </Flex>

    <Text size="sm">{children}</Text>
  </HStack>
);
