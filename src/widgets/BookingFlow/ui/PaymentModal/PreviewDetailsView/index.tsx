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
import { useMemo, useState } from "react";
import {
  type DictionaryTypes,
  type PackageEntity,
  useDictionary,
} from "@entities/package";
import { Icon, type IconName } from "@foundation/Iconography";
import moment from "moment";
import { Layout } from "../Layout.tsx";
import { TermsAndConditionsSection } from "./ui/TermsAndConditionsSection.tsx";
import { BookingRulesModal } from "./ui/BookingRulesModal.tsx";

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
}: PreviewDetailsViewProps) => {
  const { t, i18n } = useTranslation();
  const [isPromoCodeModalOpen, setIsPromoCodeModalOpen] = useState(false);
  const [promoCodeValue, setPromoCodeValue] = useState("");
  const [promoCodeError, setPromoCodeError] = useState<string | null>(null);
  const [isBookingRulesModalOpen, setIsBookingRulesModalOpen] = useState(false);
  const [isCancellationPolicyModalOpen, setIsCancellationPolicyModalOpen] =
    useState(false);
  const [policyModalType, setPolicyModalType] = useState<
    "booking" | "cancellation"
  >("booking");
  const isLateCheckout = useRecoilValue(isLateCheckoutAtom);

  const handleUsePromocode = () => {
    setIsPromoCodeModalOpen(true);
    onUsePromocode();
  };

  const handleClosePromoCodeModal = () => {
    setIsPromoCodeModalOpen(false);
    setPromoCodeValue(""); // Reset promo code when closing modal
    setPromoCodeError(null); // Clear error when closing modal
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
            handleClosePromoCodeModal();
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

  const paymentDetailsItems = useMemo((): ListItemType[] => {
    const currentPaymentAmount = promoCodeStatus.isApplied
      ? promoCodeStatus.finalAmount -
        (packageDetails.price - (paymentAmount || 0))
      : paymentAmount || 0;

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

    if (!isFullPricePayment) {
      const remainingAmount = promoCodeStatus.isApplied
        ? promoCodeStatus.finalAmount - currentPaymentAmount
        : packageDetails.price - currentPaymentAmount;

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
        height="full"
        maxH={{ base: "calc(100dvh - 82px)", md: "526px" }}
      >
        <Box
          flex="1"
          p="4"
          overflowY="auto"
          bg="gray.50"
          height="calc(100% - 174px)"
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
                  ? formatNumber(promoCodeStatus.finalAmount) + "֏"
                  : formatNumber(paymentAmount || 0) + "֏"}
              </Text>
            </Flex>
          </Flex>

          <Button
            variant="solid-blue"
            width="full"
            mt="3"
            onClick={onPay}
            isLoading={isLoadingBooking}
            size="lg"
          >
            {t("pay")}
          </Button>

          {prepaymentInfo?.paymentType !== "NoDownPayment" &&
            !promoCodeStatus.isApplied && (
              <Button
                variant="solid-gray"
                width="full"
                mt="2"
                onClick={handleUsePromocode}
                size="lg"
              >
                {t("usePromoCode")}
              </Button>
            )}
        </Box>
      </Flex>

      <Portal>
        <Layout
          title={t("usePromoCode")}
          isOpen={isPromoCodeModalOpen}
          closeModal={handleClosePromoCodeModal}
        >
          <Box
            px="4"
            py="6"
            width="full"
            maxW="420px"
            height={{ base: "calc(100dvh - 164px)", md: "auto" }}
            minH="136px"
          >
            <VStack spacing={2} align="stretch">
              <Input
                width="full"
                value={promoCodeValue}
                onChange={(e) => handlePromoCodeInputChange(e.target.value)}
                state={promoCodeError ? "invalid" : "default"}
                placeholder={t`promoCodePlaceholder`}
              />
              {promoCodeError && (
                <Text color="red.500" fontSize="sm">
                  {promoCodeError}
                </Text>
              )}
            </VStack>
          </Box>

          <Box p="4" borderTop="1px solid" borderColor="gray.100" width="full">
            <Button
              variant="solid-blue"
              width="full"
              size="lg"
              isDisabled={isApplyButtonDisabled}
              onClick={handleApplyPromoCode}
            >
              {t("apply")}
            </Button>
          </Box>
        </Layout>
      </Portal>
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
