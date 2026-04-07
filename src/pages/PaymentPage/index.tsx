import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Text } from "@ui";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import {
  type NormalizedRequestEntity,
  type PackageEntity,
  type PrepaymentInfo,
  useBookPackage,
  useCalculatePrepayment,
  usePayRemainingAmount,
  type PaymentSystem,
} from "@entities/package";
import { useUserContext } from "@entities/user";
import { useLanguageNavigate } from "@/hooks/useLanguageNavigate";
import { LANGUAGE_NAME_MAP, type LanguageName } from "@shared/model";
import { PaymentFormView } from "@widgets/BookingFlow/ui/PaymentModal/PaymentFormView/index.tsx";
import { PaymentMethodView } from "@widgets/BookingFlow/ui/PaymentModal/PaymentMethodView.tsx";
import type { PaymentOption } from "@widgets/BookingFlow/ui/PaymentModal/types";
import { PaymentMethod } from "@widgets/BookingFlow/ui/PaymentModal/types";
import type { Travelers } from "@widgets/TravelersModal/ui/types";

export type PaymentPageState = {
  mode?: "full" | "remainingOnly";
  packageDetails: PackageEntity;
  prepaymentInfo?: PrepaymentInfo | null;
  travelers?: Travelers;
  request?: NormalizedRequestEntity;
  discountedFullPrice?: number;
  promoCode?: string;
};

type Step = "paymentForm" | "paymentMethod";

export const PaymentPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { navigateToMyPackages, navigateBack } = useLanguageNavigate();
  const state = location.state as PaymentPageState | null;
  const isRemainingOnly = state?.mode === "remainingOnly";

  const [step, setStep] = useState<Step>(isRemainingOnly ? "paymentMethod" : "paymentForm");
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentOption, setPaymentOption] = useState<PaymentOption>("pay");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | string>(PaymentMethod.bankCard);


  const packageDetails = state?.packageDetails;
  const request = state?.request;
  const travelersFromState = state?.travelers;

  const isHotelPackage = useMemo(
    () => !packageDetails?.destinationFlight?.id,
    [packageDetails?.destinationFlight?.id],
  );

  useEffect(() => {
    localStorage.setItem('bookingResultSource', 'payment');
  }, []);
  // Discounted full price and promo can come from navigation state (e.g. My Packages promo flow).
  // Base "full price" depends on mode:
  // - remainingOnly: remainingPaymentAmount of the request
  // - full: original package price
  const baseFullPriceForMode =
    isRemainingOnly
      ? request?.remainingPaymentAmount ?? 0
      : packageDetails?.price ?? 0;

  const discountedFullPrice =
    state?.discountedFullPrice ?? baseFullPriceForMode;

  const { data: prepaymentInfoFromApi = null } = useCalculatePrepayment(
    {
      travelAgencyId: packageDetails?.travelAgency?.id ?? 0,
      bookingType: isHotelPackage ? 2 : 1,
      destinationId: packageDetails?.city?.id ?? 0,
      startDate: packageDetails?.checkin ?? packageDetails?.destinationFlight?.departureDate ?? "",
      fullPrice: discountedFullPrice,
      calculationSource: "myBookings",
    },
    { enabled: !!packageDetails?.checkin || !!packageDetails?.destinationFlight?.departureDate },
  );

  const prepaymentInfo = state?.prepaymentInfo ?? prepaymentInfoFromApi;

  // Use discounted full price consistently in the UI and logic on this page
  // by overriding the price we pass down into payment components.
  const effectivePackageDetails: PackageEntity | undefined = packageDetails
    ? { ...packageDetails, price: discountedFullPrice }
    : undefined;

  const travelers: Travelers = useMemo(
    () =>
      travelersFromState ?? {
        adults: (request?.travelers ?? []).map((t) => ({
          firstName: t.firstName,
          lastName: t.lastName,
          dateOfBirth: t.dateOfBirth ?? "",
        })),
        children: [],
      },
    [travelersFromState, request?.travelers],
  );

  const hasValidState =
    effectivePackageDetails &&
    (isRemainingOnly
      ? request
      : request
        ? true
        : (effectivePackageDetails.offerId != null && effectivePackageDetails.offerId > 0));

  useEffect(() => {
    if (!hasValidState) {
      navigateToMyPackages({ queryParams: "tab=0", replace: true });
    }
  }, [hasValidState, navigateToMyPackages]);

  if (!hasValidState) {
    return null;
  }

  // If API says only full payment is allowed, skip payment type step and go straight to method once
  const [skippedFormForFullPayment, setSkippedFormForFullPayment] = useState(false);
  useEffect(() => {
    if (
      !skippedFormForFullPayment &&
      prepaymentInfo?.paymentType === "FullPricePayment" &&
      step === "paymentForm"
    ) {
      setPaymentAmount(effectivePackageDetails!.price ?? 0);
      setPaymentOption("payFull");
      setStep("paymentMethod");
      setSkippedFormForFullPayment(true);
    }
  }, [prepaymentInfo?.paymentType, step, packageDetails?.price, skippedFormForFullPayment]);

  const handleFormSubmit = (amount: number, option: PaymentOption) => {
    setPaymentAmount(amount);
    setPaymentOption(option);
    setStep("paymentMethod");
  };

  const handleMethodBack = () => {
    if (skippedFormForFullPayment) {
      navigateBack();
    } else {
      setStep("paymentForm");
    }
  };

  return (
    <PageLayout background="white" showFooter={false}>
      <Box maxW="500px" w="100%" mx="auto" py={{ base: 6, md: 10 }} px={4}>
        <Flex align="center" justify="space-between" mb={6}>
          <Text size="md" fontWeight="semibold">
            {t(step === "paymentForm" ? "payment" : "paymentMethod")}
          </Text>
        </Flex>

        {step === "paymentForm" && (
          <PaymentFormView
            packageDetails={effectivePackageDetails!}
            prepaymentInfo={prepaymentInfo}
            initialPaymentOption="pay"
            onSubmit={handleFormSubmit}
            onBackClick={() => navigateBack()}
            renderAsPage
            isLoadingBooking={false}
            disableNoPrepayment={!!request}
          />
        )}

        {step === "paymentMethod" && (
          isRemainingOnly ? (
            <RemainingPaymentStep
              packageDetails={effectivePackageDetails!}
              request={request!}
              travelers={travelers}
              selectedMethod={selectedMethod}
              onMethodChange={setSelectedMethod}
              onBackClick={() => navigateBack()}
              autoBookZero={!!state?.promoCode && discountedFullPrice <= 0}
            />
          ) : (
            <PaymentMethodStep
              packageDetails={effectivePackageDetails!}
              originalPrice={packageDetails!.price}
              request={request}
              travelers={travelers}
              paymentAmount={paymentAmount}
              paymentOption={paymentOption}
              selectedMethod={selectedMethod}
              onMethodChange={setSelectedMethod}
              onBackClick={handleMethodBack}
            />
          )
        )}
      </Box>
    </PageLayout>
  );
};

function RemainingPaymentStep({
  packageDetails,
  request,
  travelers,
  selectedMethod,
  onMethodChange,
  onBackClick,
  autoBookZero = false,
}: {
  packageDetails: PackageEntity;
  request: NormalizedRequestEntity;
  travelers: Travelers;
  selectedMethod: PaymentMethod | string;
  onMethodChange: (m: PaymentMethod | string) => void;
  onBackClick: () => void;
  autoBookZero?: boolean;
}) {
  const { navigateToBookingResult } = useLanguageNavigate();
  const { i18n } = useTranslation();
  const { user } = useUserContext();
  const location = useLocation();
  const state = location.state as PaymentPageState | null;
  const promoCodeFromState = state?.promoCode;
  const { mutateAsync: bookPackageAsync, isPending: isLoadingBookingByBook } = useBookPackage();
  const { mutateAsync: payRemainingAmountAsync, isPending: isLoadingBooking } =
    usePayRemainingAmount({
      onSuccess: (res) => {
        if (!res?.success) {
          navigateToBookingResult({ error: true, replace: true });
          return;
        }
        if (!res.bookingPaymentUrl || res.bookingPaymentUrl === "amount_is_zero") {
          navigateToBookingResult({ success: true, replace: true, fromPayment: true });
          return;
        }
        if (selectedMethod === ("VPos" as PaymentSystem)) {
          window.location.href =
            res.bookingPaymentUrl +
            `&lang=${LANGUAGE_NAME_MAP[i18n.language as LanguageName]}`;
        } else {
          window.location.href = res.bookingPaymentUrl;
        }
      },
      onError: () => {
        navigateToBookingResult({ error: true, replace: true });
      },
    });

  const handlePay = async (amountToBePaid?: number) => {
    try {
      await payRemainingAmountAsync({
        requestId: request.id,
        paymentSystem: selectedMethod,
        amountToBePaid,
      });
    } catch {
      // handled in hook callbacks
    }
  };

  const handleBookWithZero = async () => {
    const travelersList = [...travelers.adults, ...travelers.children];
    const bookInput: any = {
      requestId: request.id,
      cityId: packageDetails.city.id,
      price: packageDetails.price,
      hotelId: packageDetails.hotel.id,
      travelAgencyId: packageDetails.travelAgency.id,
      offerId: packageDetails.offerId,
      roomType: packageDetails.roomType,
      email: user?.email ?? "",
      notes: JSON.stringify(request.notes ?? {}),
      phoneNumber: user?.phoneNumber ?? "",
      amountToBePaid: 0,
      usdRate: packageDetails.usdRate,
      currency: packageDetails.currency,
      rate: packageDetails.rate,
      travelers: travelersList,
      paymentSystem: selectedMethod as PaymentSystem,
    };

    if (promoCodeFromState) {
      bookInput.promoCode = promoCodeFromState;
    }

    if (packageDetails.destinationFlight?.departureDate) {
      bookInput.startDate = packageDetails.destinationFlight.departureDate;
      bookInput.endDate = packageDetails.returnFlight.departureDate;
      bookInput.destinationFlightId = packageDetails.destinationFlight.id;
      bookInput.returnFlightId = packageDetails.returnFlight.id;
      bookInput.bookingType = 1;
    } else {
      bookInput.startDate = packageDetails.checkin;
      bookInput.endDate = packageDetails.checkout;
      bookInput.bookingType = 2;
      bookInput.foodType = packageDetails.foodType ?? 0;
    }

    try {
      const res = await bookPackageAsync(bookInput);
      if (!res.success) {
        navigateToBookingResult({ error: true, replace: true });
        return;
      }
      if (!res.bookingPaymentUrl || res.bookingPaymentUrl === "amount_is_zero") {
        navigateToBookingResult({ success: true, replace: true, fromPayment: true });
        return;
      }
      if (selectedMethod === ("VPos" as PaymentSystem)) {
        window.location.href =
          res.bookingPaymentUrl +
          `&lang=${LANGUAGE_NAME_MAP[i18n.language as LanguageName]}`;
      } else {
        window.location.href = res.bookingPaymentUrl;
      }
    } catch {
      navigateToBookingResult({ error: true, replace: true });
    }
  };

  useEffect(() => {
    if (!autoBookZero) return;
    if (isLoadingBookingByBook) return;
    handleBookWithZero();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoBookZero]);

  if (autoBookZero) {
    return null;
  }

  return (
    <PaymentMethodView
      packageDetails={packageDetails}
      selectedMethod={selectedMethod}
      onMethodChange={onMethodChange}
      onSubmit={handlePay}
      isLoadingBooking={isLoadingBooking}
      renderAsPage
      onBackClick={onBackClick}
    />
  );
}

function PaymentMethodStep({
  packageDetails,
  originalPrice,
  request,
  travelers,
  paymentAmount,
  paymentOption,
  selectedMethod,
  onMethodChange,
  onBackClick,
}: {
  packageDetails: PackageEntity;
  originalPrice: number;
  request?: NormalizedRequestEntity | null;
  travelers: Travelers;
  paymentAmount: number;
  paymentOption: PaymentOption;
  selectedMethod: PaymentMethod | string;
  onMethodChange: (m: PaymentMethod | string) => void;
  onBackClick: () => void;
}) {
  const { t, i18n } = useTranslation();
  const { user } = useUserContext();
  const { navigateToBookingResult } = useLanguageNavigate();
  const { mutateAsync: bookPackageAsync, isPending: isLoadingBooking } = useBookPackage();

  // Full payment comparison uses the (possibly discounted) price shown in UI.
  const isFullPricePayment =
    paymentOption === "payFull" || paymentAmount >= packageDetails.price;

  // Promo information comes from navigation state (My Packages flow).
  const location = useLocation();
  const state = location.state as PaymentPageState | null;
  const promoCodeFromState = state?.promoCode;
  const discountedFullPriceFromState = state?.discountedFullPrice;

  const paymentSystem: PaymentSystem = selectedMethod as PaymentSystem;

  const handlePay = async () => {
    if (!request?.id) {
      navigateToBookingResult({ error: true, replace: true });
      return;
    }

    // Backend should still see the original full package price,
    // even if UI shows a discounted total.
    const baseFullPrice = originalPrice;
    const isPromoApplied =
      !!promoCodeFromState && typeof discountedFullPriceFromState === "number";

    // For full payment, if promo is applied, pay the discounted full price; otherwise original.
    // For partial payment, respect the amount the user entered.
    const amountToBePaid = isFullPricePayment
      ? (isPromoApplied ? discountedFullPriceFromState! : baseFullPrice)
      : paymentAmount;
    const travelersList = [...travelers.adults, ...travelers.children];

    const bookInput: any = {
      requestId: request.id,
      cityId: packageDetails.city.id,
      // Keep original (pre-discount) price so backend still knows full package price
      price: baseFullPrice,
      hotelId: packageDetails.hotel.id,
      travelAgencyId: packageDetails.travelAgency.id,
      offerId: packageDetails.offerId,
      roomType: packageDetails.roomType,
      email: user?.email ?? "",
      notes: JSON.stringify(request.notes ?? {}),
      phoneNumber: user?.phoneNumber ?? "",
      amountToBePaid: +amountToBePaid,
      usdRate: packageDetails.usdRate,
      currency: packageDetails.currency,
      rate: packageDetails.rate,
      travelers: travelersList,
      paymentSystem,
    };

    if (promoCodeFromState) {
      bookInput.promoCode = promoCodeFromState;
    }

    if (packageDetails.destinationFlight?.departureDate) {
      bookInput.startDate = packageDetails.destinationFlight.departureDate;
      bookInput.endDate = packageDetails.returnFlight.departureDate;
      bookInput.destinationFlightId = packageDetails.destinationFlight.id;
      bookInput.returnFlightId = packageDetails.returnFlight.id;
      bookInput.bookingType = 1;
    } else {
      bookInput.startDate = packageDetails.checkin;
      bookInput.endDate = packageDetails.checkout;
      bookInput.bookingType = 2;
      bookInput.foodType = packageDetails.foodType ?? 0;
    }

    try {
      sessionStorage.setItem("isPaymentRedirect", "1");
      const res = await bookPackageAsync(bookInput);
      if (!res.success) {
        navigateToBookingResult({ error: true, replace: true });
        return;
      }
      if (!res.bookingPaymentUrl) {
        navigateToBookingResult({ success: true, replace: true, fromPayment: true });
        return;
      }
      try {
        localStorage.setItem('bookingResultSource', 'payment');
      } catch {
        // ignore
      }

      if (res.bookingPaymentUrl === "amount_is_zero") {
        navigateToBookingResult({ success: true, replace: true, fromPayment: true });
        return;
      }
      if (paymentSystem === ("VPos" as PaymentSystem.VPos)) {
        window.location.href =
          res.bookingPaymentUrl +
          `&lang=${LANGUAGE_NAME_MAP[i18n.language as LanguageName]}`;
      } else {
        window.location.href = res.bookingPaymentUrl;
      }
    } catch {
      navigateToBookingResult({ error: true, replace: true });
    }
  };

  return (
    <PaymentMethodView
      packageDetails={packageDetails}
      selectedMethod={selectedMethod}
      onMethodChange={onMethodChange}
      onSubmit={handlePay}
      isLoadingBooking={isLoadingBooking}
      renderAsPage
      onBackClick={onBackClick}
    />
  );
}
