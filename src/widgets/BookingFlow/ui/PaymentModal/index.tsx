import { Layout } from "./Layout.tsx";
import {
  PaymentMethod,
  type PaymentModalProps,
  type PaymentModalView,
  type PaymentOption,
  VIEW_CONTENT_MAP,
} from "./types.ts";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useRef, useState } from "react";
import { PaymentFormView } from "./PaymentFormView/index.tsx";
import { PaymentErrorView } from "./PaymentErrorView.tsx";
import { PaymentMethodView } from "./PaymentMethodView.tsx";
import { AmeriaPayView } from "./AmeriaPayView.tsx";
import {
  DictionaryTypes,
  PaymentSuccessModal,
  useDictionary,
  type PaymentSystem,
} from "@entities/package";
import { PreviewDetailsView } from "@/widgets/BookingFlow/ui/PaymentModal/PreviewDetailsView/index.tsx";
import { BookingStep, metaEvents } from "@/shared/configs/metaEvents.ts";
import { Button, Illustration, Text } from "@ui";
import { Flex } from "@chakra-ui/react";

export const PaymentModal = ({
  closeModal,
  onSuccess,
  onBackClick,
  packageDetails,
  isOpen = false,
  isLoadingBooking,
  view,
  isBooked,
  prepaymentInfo,
  travelers,
  validatePromoCode,
  handleLogEvent,
  skipPreviewStep = false,
  renderAsPage = false,
  onViewChange,
  onPaymentOptionChange,
  paymentOption: paymentOptionFromParent,
  onNavigateToMyPackages,
  onSuccessClose,
  isLateCheckout: isLateCheckoutProp,
  onPromoDiscountedPriceChange,
}: PaymentModalProps) => {
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState<PaymentModalView>(
    view || "paymentForm",
  );
  const [ameriaPayUrl, setAmeriaPayUrl] = useState<string>("");
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentOption, setPaymentOption] = useState<PaymentOption>(
    paymentOptionFromParent ?? "pay",
  );
  const isFullPricePayment = useMemo(
    () =>
      paymentOption === "payFull" ||
      paymentAmount === packageDetails.price ||
      prepaymentInfo?.paymentType === "FullPricePayment",
    [paymentOption, paymentAmount, packageDetails.price, prepaymentInfo?.paymentType],
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | string | null>(null);
  const selectedPaymentMethodRef = useRef<PaymentMethod | string>(PaymentMethod.bankCard);
  const [promoCodeStatus, setPromoCodeStatus] = useState<{
    isApplied: boolean;
    code: string;
    discount: number;
    finalAmount: number;
  }>({
    isApplied: false,
    code: "",
    discount: 0,
    finalAmount: 0,
  });

  const calculatePromoCodePaymentAmount = useMemo(() => {
    if (promoCodeStatus.isApplied) {
      return isFullPricePayment ? promoCodeStatus.finalAmount : paymentAmount;
    }
    return isFullPricePayment ? packageDetails.price : paymentAmount;
  }, [
    promoCodeStatus.isApplied,
    promoCodeStatus.finalAmount,
    paymentAmount,
    packageDetails.price,
    isFullPricePayment,
  ]);

  const ViewComponent = useMemo(() => {
    const ViewComponentMap = {
      paymentMethod: () => (
        <PaymentMethodView
          selectedMethod={selectedPaymentMethod ?? PaymentMethod.bankCard}
          onMethodChange={(method) => {
            selectedPaymentMethodRef.current = method;
            setSelectedPaymentMethod(method);
          }}
          onSubmit={() => {
            const method = selectedPaymentMethodRef.current;
            handleLogPaymentInfoEvent(method);
            handlePay(method as PaymentMethod);
            setSelectedPaymentMethod(method);
          }}
          isLoadingBooking={isLoadingBooking}
          packageDetails={packageDetails}
          onBackClick={() => setActiveView("previewDetails")}
          renderAsPage={renderAsPage}
        />
      ),
      ameriaPay: () => <AmeriaPayView paymentUrl={ameriaPayUrl} />,
      paymentForm: () => (
        <PaymentFormView
          onSubmit={handleContinue}
          packageDetails={packageDetails}
          isLoadingBooking={isLoadingBooking}
          initialPaymentOption={paymentOption}
          isBooked={isBooked}
          prepaymentInfo={prepaymentInfo}
          onBackClick={renderAsPage ? onBackClick : undefined}
          renderAsPage={renderAsPage}
          onPaymentOptionChange={onPaymentOptionChange}
        />
      ),
      paymentError: () => (
        <PaymentErrorView
          onGoToMyPackages={renderAsPage && onNavigateToMyPackages ? () => onNavigateToMyPackages('tab=1') : undefined}
          renderAsPage={renderAsPage}
        />
      ),
      paymentSuccess: () => (
        renderAsPage ? (
          <Flex
            direction="column"
            align="center"
            justify="center"
            width="full"
            py="10"
            px="4"
            maxW="402px"
            mx="auto"
            minH={{ base: 'calc(100dvh - 200px)', md: '400px' }}
          >
            <Illustration name="success" />
            <Text size="sm" mt="4" align="center">
              {t`bookingSuccessModalText`}
            </Text>
            <Button
              mt="6"
              variant="solid-blue"
              size="lg"
              width="full"
              onClick={onSuccessClose ?? (onNavigateToMyPackages ? () => onNavigateToMyPackages() : closeModal)}
            >
              {t`myPackages`}
            </Button>
          </Flex>
        ) : (
          <PaymentSuccessModal
            closeModal={onSuccessClose ?? closeModal}
          />
        )
      ),
      previewDetails: () => (
        <PreviewDetailsView
          onPay={() => {
            if (paymentOption === "noPrepayment") {
              handlePay(PaymentMethod.bankCard);
            } else if (promoCodeStatus.isApplied && calculatePromoCodePaymentAmount === 0) {
              handlePay(PaymentMethod.bankCard);
            } else {
              setActiveView("paymentMethod");
            }
          }}
          onUsePromocode={() => {
            // TODO: implement promocode logic
          }}
          isLoadingBooking={isLoadingBooking}
          packageDetails={packageDetails}
          travelers={travelers || { adults: [], children: [] }}
          paymentAmount={
            isFullPricePayment ? packageDetails.price : paymentAmount
          }
          isFullPricePayment={isFullPricePayment}
          prepaymentInfo={prepaymentInfo}
          validatePromoCode={validatePromoCode}
          promoCodeStatus={promoCodeStatus}
          setPromoCodeStatus={setPromoCodeStatus}
          paymentOption={paymentOption}
          onBackClick={renderAsPage ? () => setActiveView("paymentForm") : undefined}
          renderAsPage={renderAsPage}
          isLateCheckout={isLateCheckoutProp}
          onPromoDiscountedPriceChange={onPromoDiscountedPriceChange}
        />
      ),
    };

    return ViewComponentMap[activeView];
  }, [
    activeView,
    ameriaPayUrl,
    packageDetails,
    isLoadingBooking,
    isBooked,
    paymentAmount,
    paymentOption,
    prepaymentInfo,
    promoCodeStatus,
    isFullPricePayment,
    travelers,
    selectedPaymentMethod,
    calculatePromoCodePaymentAmount,
    isLateCheckoutProp,
  ]);

  useEffect(() => {
    if (view) {
      setActiveView(view);
    }
  }, [view]);

  useEffect(() => {
    onViewChange?.(activeView);
  }, [activeView, onViewChange]);

  const isHotelPackage = useMemo(
    () =>
      !(
        packageDetails?.destinationFlight?.id && packageDetails?.returnFlight?.id
      ),
    [packageDetails?.destinationFlight?.id, packageDetails?.returnFlight?.id],
  );

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

  const { data: roomTypes = [] } = useDictionary(
    "RoomTypeDictionary" as DictionaryTypes.RoomTypeDictionary,
  );

  const handleLogPurchaseEvent = (amount: number) => {
    const pd = packageDetails as any;
    metaEvents.purchase({
      content_type: isGroupTourPackage ? "package" : isHotelPackage ? "hotel" : "package",
      value: amount,
      currency: packageDetails.currency,
      offer_id: packageDetails.offerId,
      hotel_id: pd?.hotel?.id,
      destination: pd?.city?.nameEng ?? pd?.agency?.name ?? pd?.name?.eng ?? "",
      checkin_date: pd?.checkin ?? "",
      checkout_date: pd?.checkout ?? "",
      num_nights: pd?.nights,
      num_adults: travelers?.adults.length || 0,
      num_children: travelers?.children.length || 0,
      room_type: pd?.roomType != null
        ? roomTypes.find(({ key }: any) => Number(key) === Number(pd.roomType))?.value
        : undefined,
    });
  }

  const handlePay = async (paymentMethod: PaymentMethod) => {
    const amount = calculatePromoCodePaymentAmount;
    try {
      handleLogPurchaseEvent(amount);
      handleLogEvent({ name: BookingStep.TermsConfirmed, number: 4 });

      const promoCodeInfo = promoCodeStatus.isApplied
        ? {
            promoCode: promoCodeStatus.code,
            initialPrice: packageDetails.price,
            firstPaymentSum: amount,
          }
        : undefined;

      if (paymentMethod === PaymentMethod.ameriaPay && onSuccess) {
        await onSuccess(
          amount,
          "MyAmeriaPay" as PaymentSystem.MyAmeriaPay,
          paymentOption,
          promoCodeInfo,
        );
      } else if (paymentMethod === PaymentMethod.bankCard) {
        await onSuccess(amount, "VPos" as PaymentSystem.VPos, paymentOption, promoCodeInfo);
      } else if (paymentMethod === PaymentMethod.idram) {
        await onSuccess(amount, "IDram" as PaymentSystem.IDram, paymentOption, promoCodeInfo);
      }
    } catch (error) {
      setActiveView("paymentError");
    }
  };

  const handleLogPaymentInfoEvent = (paymentMethod?: PaymentMethod | string) => {
    const amount = isFullPricePayment ? packageDetails.price : paymentAmount;
    const pd = packageDetails as any;
    metaEvents.addPaymentInfo({
      content_type: isGroupTourPackage ? "package" : isHotelPackage ? "hotel" : "package",
      value: amount,
      currency: packageDetails.currency,
      payment_type: (paymentMethod ?? selectedPaymentMethod) ?? null,
      hotel_id: pd?.hotel?.id,
      destination: pd?.city?.nameEng ?? pd?.agency?.name ?? pd?.name?.eng ?? "",
      checkin_date: pd?.checkin ?? "",
      checkout_date: pd?.checkout ?? "",
      room_type: pd?.roomType != null
        ? roomTypes.find(({ key }: any) => key === pd.roomType)?.value
        : undefined,
    });
  };

  const handleContinue = (amount: number, paymentOption: PaymentOption) => {
    setPaymentOption(paymentOption);

    // Reset promo code status if user switches to "noPrepayment"
    if (paymentOption === "noPrepayment" && promoCodeStatus.isApplied) {
      setPromoCodeStatus({
        isApplied: false,
        code: "",
        discount: 0,
        finalAmount: 0,
      });
    }

    if (paymentOption === "pay" || paymentOption === "payFull") {
      setPaymentAmount(amount);
      setActiveView("previewDetails");
    } else if (paymentOption === "noPrepayment") {
      setPaymentAmount(0);
      setActiveView("previewDetails");
    }
  };

  const handleBackClick = useMemo(() => {
    if (activeView === "paymentMethod") {
      return () => setActiveView("previewDetails");
    } else if (activeView === "previewDetails") {
      // return () => setActiveView("paymentMethod");
      return () => setActiveView("paymentForm");
    } else if (activeView === "paymentForm" && onBackClick) {
      return () => onBackClick();
    }

    return undefined;
  }, [activeView, onBackClick]);

  return (
    <Layout
      title={t(VIEW_CONTENT_MAP[activeView].title)}
      isOpen={isOpen}
      closeModal={closeModal}
      onBackClick={handleBackClick}
      renderAsPage={renderAsPage}
      isLoadingBooking={isLoadingBooking}
    >
      <ViewComponent />
    </Layout>
  );
};
