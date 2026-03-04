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

  const { data: prepaymentInfoFromApi = null } = useCalculatePrepayment(
    {
      travelAgencyId: packageDetails?.travelAgency?.id ?? 0,
      bookingType: isHotelPackage ? 2 : 1,
      destinationId: packageDetails?.city?.id ?? 0,
      startDate: packageDetails?.checkin ?? packageDetails?.destinationFlight?.departureDate ?? "",
      fullPrice: packageDetails?.price ?? 0,
      calculationSource: "myBookings",
    },
    { enabled: !!packageDetails?.checkin || !!packageDetails?.destinationFlight?.departureDate },
  );

  const prepaymentInfo = state?.prepaymentInfo ?? prepaymentInfoFromApi;

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
    packageDetails &&
    (isRemainingOnly
      ? request
      : request
        ? true
        : (packageDetails.offerId != null && packageDetails.offerId > 0));

  useEffect(() => {
    if (!hasValidState) {
      navigateToMyPackages({ queryParams: "tab=0", replace: true });
    }
  }, [hasValidState, navigateToMyPackages]);

  if (!hasValidState) {
    return null;
  }

  const handleFormSubmit = (amount: number, option: PaymentOption) => {
    setPaymentAmount(amount);
    setPaymentOption(option);
    setStep("paymentMethod");
  };

  const handleMethodBack = () => setStep("paymentForm");

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
            packageDetails={packageDetails}
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
              packageDetails={packageDetails}
              request={request!}
              selectedMethod={selectedMethod}
              onMethodChange={setSelectedMethod}
              onBackClick={() => navigateBack()}
            />
          ) : (
            <PaymentMethodStep
              packageDetails={packageDetails}
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
  selectedMethod,
  onMethodChange,
  onBackClick,
}: {
  packageDetails: PackageEntity;
  request: NormalizedRequestEntity;
  selectedMethod: PaymentMethod | string;
  onMethodChange: (m: PaymentMethod | string) => void;
  onBackClick: () => void;
}) {
  const { mutateAsync: payRemainingAmountAsync, isPending: isLoadingBooking } =
    usePayRemainingAmount();

  const handlePay = async () => {
    try {
      await payRemainingAmountAsync({
        requestId: request.id,
        paymentSystem: selectedMethod,
      });
    } catch {
      // usePayRemainingAmount redirects on success; on error we stay on page
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

function PaymentMethodStep({
  packageDetails,
  request,
  travelers,
  paymentAmount,
  paymentOption,
  selectedMethod,
  onMethodChange,
  onBackClick,
}: {
  packageDetails: PackageEntity;
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

  const isFullPricePayment =
    paymentOption === "payFull" || paymentAmount >= packageDetails.price;

  const paymentSystem: PaymentSystem = selectedMethod as PaymentSystem;

  const handlePay = async () => {
    if (!request?.id) {
      navigateToBookingResult({ error: true, replace: true });
      return;
    }

    const amountToBePaid = isFullPricePayment ? packageDetails.price : paymentAmount;
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
      amountToBePaid: +amountToBePaid,
      usdRate: packageDetails.usdRate,
      currency: packageDetails.currency,
      rate: packageDetails.rate,
      travelers: travelersList,
      paymentSystem,
    };

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
