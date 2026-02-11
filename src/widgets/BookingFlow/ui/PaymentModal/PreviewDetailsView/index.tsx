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
} from "../types.ts";
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
import { TermsAndConditionsSection } from "./ui/TermsAndConditionsSection.tsx";
import { BookingRulesModal } from "./ui/BookingRulesModal.tsx";
import { PromoCode } from "./ui/PromoCode.tsx";

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
}: PreviewDetailsViewProps) => {
  const { t, i18n } = useTranslation();
  const [promoCodeValue, setPromoCodeValue] = useState("");
  const [hasPromoCode, setHasPromoCode] = useState(promoCodeStatus.isApplied);
  const [promoCodeError, setPromoCodeError] = useState<string | null>(null);
  const [isBookingRulesModalOpen, setIsBookingRulesModalOpen] = useState(false);
  const [isCancellationPolicyModalOpen, setIsCancellationPolicyModalOpen] =
    useState(false);
  const [policyModalType, setPolicyModalType] = useState<
    "booking" | "cancellation"
  >("booking");
  const isLateCheckout = useRecoilValue(isLateCheckoutAtom);

  // Reset promo code status when payment option changes to "noPrepayment"
  useEffect(() => {
    if (paymentOption === "noPrepayment" && promoCodeStatus.isApplied) {
      setPromoCodeStatus({
        isApplied: false,
        code: "",
        discount: 0,
        finalAmount: 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentOption]);

  const handleUsePromocode = () => {
    onUsePromocode();
  };

  const handlePromoCodeInputChange = (value: string) => {
    setPromoCodeValue(value);
    // Clear error when user starts typing
    if (promoCodeError) {
      setPromoCodeError(null);
    }
  };

  const handleApplyPromoCode = () => {
    if (isApplyButtonDisabled) return;

    validatePromoCode.mutate(
      {
        promoCode: promoCodeValue.trim(),
        price: packageDetails.price,
        agencyId: packageDetails.travelAgency.id,
        destinationId: packageDetails.city.id,
        hotelId: packageDetails.hotel.id,
        startDate: packageDetails.checkin,
        bookingType: prepaymentInfo?.bookingType,
        prePaymentAmount: paymentAmount
      },
      {
        onSuccess: (data: any) => {
          if (data.success && data.isValid) {
            console.log(
              `Promo code applied! Discount: ${data.discount}, Final Amount: ${data.finalAmount}`,
            );

            // Update promo code status
            setPromoCodeStatus({
              isApplied: true,
              code: promoCodeValue.trim(),
              discount: data.discount,
              finalAmount: data.finalAmount,
            });
          } else {
            console.log(`Promo code error: ${data.message}`);

            // Set inline error message based on error code
            const errorMessage = getPromoCodeErrorMessage(
              data.errorCode || "INVALID_CODE",
            );
            setPromoCodeError(errorMessage);
          }
        },
        onError: (error: any) => {
          console.error("Failed to validate promo code:", error);
          setPromoCodeError(t`promoCodeValidationFailed`);
        },
      },
    );
  };

  const isApplyButtonDisabled = promoCodeValue.trim().length < 3;

  const getPromoCodeErrorMessage = (errorCode: string): string => {
    const errorMessages: Record<string, string> = {
      "Invalid-Expired-Code": t`promoCodeInvalid`,
      "Usage-Limit-Reached": t`promoCodeExpired`,
      "Minimum-Value-Not-Met": t`promoCodeMinimumValue`,
      "Scope-Mismatch": t`promoCodeScopeMismatch`,
      "New-User-Code-by-Existing-User": t`promoCodeNewUserOnly`,
      INVALID_CODE: t`promoCodeInvalid`,
    };

    return errorMessages[errorCode] || t`promoCodeInvalid`;
  };

  /**
   * Calculates promo code discount distribution based on user input and total price
   *
   * Rules:
   * 1. If userInput == totalPrice: Discount applied to whole price (single payment)
   * 2. If userInput != totalPrice:
   *    - Case 1: Remainder <= discount / 2: Full discount to first payment (single payment)
   *    - Case 2: Remainder > discount / 2: Half discount to first, half to second payment
   */
  const calculatePromoCodePayments = useMemo(() => {
    if (!promoCodeStatus.isApplied) {
      return {
        firstPayment: paymentAmount || 0,
        secondPayment: isFullPricePayment ? 0 : (packageDetails.price - (paymentAmount || 0)),
        isSinglePayment: isFullPricePayment,
      };
    }

    const totalPrice = packageDetails.price;
    const userInput = paymentAmount || 0;
    const discount = promoCodeStatus.discount;
    const finalAmount = promoCodeStatus.finalAmount;

    // Case 1: User input equals total price (full payment)
    if (userInput === totalPrice) {
      return {
        firstPayment: finalAmount,
        secondPayment: 0,
        isSinglePayment: true,
      };
    }

    // Case 2: User input is different from total price (partial payment)
    const remainder = totalPrice - userInput;

    // Case 2a: Remainder <= discount / 2
    // Apply full discount to first payment (single payment)
    if (remainder <= discount / 2) {
      return {
        firstPayment: finalAmount,
        secondPayment: 0,
        isSinglePayment: true,
      };
    }

    // Case 2b: Remainder > discount / 2
    // Apply half discount to first payment, half to second payment
    const halfDiscount = discount / 2;
    const firstPayment = userInput - halfDiscount;
    const secondPayment = remainder - halfDiscount;

    return {
      firstPayment,
      secondPayment,
      isSinglePayment: false,
    };
  }, [
    promoCodeStatus.isApplied,
    promoCodeStatus.discount,
    promoCodeStatus.finalAmount,
    paymentAmount,
    packageDetails.price,
    isFullPricePayment,
  ]);

  const paymentDetailsItems = useMemo((): ListItemType[] => {
    const currentPaymentAmount = calculatePromoCodePayments.firstPayment;

    const items: ListItemType[] = [
      {
        key: t`price`,
        value: formatNumber(packageDetails.price) + "֏",
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

      items.push({
        key: t`balance`,
        value: formatNumber(remainingAmount) + "֏",
        isStrikethrough: false,
      });
      items.push({
        key: t`nextPaymentDate`,
        value: formatDate(prepaymentInfo?.firstPaymentDate || ""),
        isStrikethrough: false,
      });
    }

    return items;
  }, [
    isFullPricePayment,
    packageDetails.price,
    paymentAmount,
    promoCodeStatus,
    calculatePromoCodePayments,
    prepaymentInfo?.firstPaymentDate,
    t,
  ]);

  const countryName = useMemo(() => {
    const key =
      `name${LANGUAGE_PREFIX[i18n.language as LanguageName]}` as keyof PackageEntity["city"]["country"];

    return (packageDetails?.city.country[key] as string) || "";
  }, [i18n.language, packageDetails?.city.country.nameArm]);

  const cityName = useMemo(() => {
    const key =
      `name${LANGUAGE_PREFIX[i18n.language as LanguageName]}` as keyof PackageEntity["city"];

    return (packageDetails?.city[key] as string) || "";
  }, [i18n.language, packageDetails?.city.nameArm]);

  const isHotelPackage = useMemo(
    () =>
      !(
        packageDetails?.destinationFlight?.id && packageDetails?.returnFlight.id
      ),
    [packageDetails?.destinationFlight?.id, packageDetails?.returnFlight?.id],
  );
  const { data: foodTypes = [] } = useDictionary(
    "FoodTypeDictionary" as DictionaryTypes.FoodTypeDictionary,
    {
      enabled: !isHotelPackage,
    },
  );

  const { data: roomTypes = [] } = useDictionary(
    "RoomTypeDictionary" as DictionaryTypes.RoomTypeDictionary,
    {
      enabled: !isHotelPackage,
    },
  );

  const foodType = useMemo<string>(
    () =>
      foodTypes.find(({ key }: any) => key === packageDetails.foodType)
        ?.value || "",
    [JSON.stringify(foodTypes)],
  );

  const summaryCards = useMemo(() => {
    const cards = isHotelPackage
      ? []
      : ([
          packageDetails.hotel.id ? (
            <SummaryCard key="hotel" iconName="bed" children={t`hotel`} />
          ) : null,
          packageDetails.destinationFlight?.id &&
          packageDetails.returnFlight?.id ? (
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
  }, [packageDetails, foodType, t]);

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
          p="4"
          overflowY={renderAsPage ? { base: "visible", md: "visible" } : { base: "auto", md: "visible" }}
          overflowX="hidden"
          bg="gray.50"
          {...(renderAsPage
            ? {}
            : { height: { base: "calc(100% - 174px)", md: "auto" }, minH: 0 })}
          pb={{
            base: 4,
            md: 4,
          }}
          mb={{base: renderAsPage ? "180px": '80px', md: 0}}
        >
          <Flex direction="column">
            <Flex align="center" justify="space-between">
              <Heading
                as="h3"
                size="sm-sm"
                color="gray.800"
                display="inline-block"
              >
                {packageDetails.nameEng}
              </Heading>

              <HotelStarBadge starsCount={packageDetails.hotel.stars} ml="2" />
            </Flex>

            <Text
              size={{ base: "sm", md: "md" }}
              color="gray.800"
              mt="2"
              fontWeight="medium"
            >
              {countryName}, {cityName}
            </Text>
          </Flex>

          <SectionLayout mt="6" listItems={paymentDetailsItems} />

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
                    packageDetails.destinationFlight.departureDate,
                    true,
                  ),
                },
                {
                  key: t`returning`,
                  value: formatDate(
                    packageDetails.returnFlight.departureDate,
                    true,
                  ),
                },
              ]}
            />
          )}

          <SectionLayout
            mt="4"
            title={t`hotelDetails`}
            listItems={[
              {
                key: t`room`,
                value:
                  roomTypes.find(
                    ({ key }: any) => key === packageDetails.roomType,
                  )?.value || "",
              },
              {
                key: t`checkIn`,
                value: formatDate(packageDetails.checkin, true),
              },
              {
                key: t`checkOut`,
                value: formatDate(packageDetails.checkout, true),
              },
              {
                key: t`lateCheckOut`,
                value: isLateCheckout ? t`included` : t`notIncluded`,
              },
            ]}
          />
          {/* PromoCode Section */}
          <PromoCode
            isApplyButtonDisabled={isApplyButtonDisabled}
            handleApplyPromoCode={handleApplyPromoCode}
            handlePromoCodeInputChange={handlePromoCodeInputChange}
            promoCodeValue={promoCodeValue}
            promoCodeError={promoCodeError}
            hasPromoCode={hasPromoCode}
            setHasPromoCode={setHasPromoCode}
            promoCodeStatus={promoCodeStatus}
          />

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
          p="4"
          width="full"
          borderTop="1px solid"
          borderColor="gray.100"
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
                  {formatNumber(packageDetails.price)}֏
                </Text>
              )}
              <Text size="md" fontWeight="bold" color="black">
                {promoCodeStatus.isApplied
                  ? formatNumber(calculatePromoCodePayments.firstPayment) + "֏"
                  : formatNumber(paymentAmount || 0) + "֏"}
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
                  {promoCodeStatus.isApplied && calculatePromoCodePayments.firstPayment === 0 ? t("pay") : t("selectPaymentMethod")}
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
              {promoCodeStatus.isApplied && calculatePromoCodePayments.firstPayment === 0 ? t("pay") : t("reserve")}
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
        { key, value, isStrikethrough, isDiscount, isHighlighted }: any,
        index: number,
      ) => (
        <ListItem key={index} as={HStack} spacing="2" width="full">
          <Text fontWeight="normal" size="sm" flexShrink={0}>
            {key}
          </Text>

          {value && (
            <>
              <Box
                backgroundImage="/assets/images/border.svg"
                height="2px"
                flexGrow={1}
                backgroundRepeat="repeat-x"
                borderRadius="full"
                mt="0.5"
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
