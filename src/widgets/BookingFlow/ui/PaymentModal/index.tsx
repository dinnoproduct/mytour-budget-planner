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
    useState<PaymentMethod | null>(null);
  const selectedPaymentMethodRef = useRef<PaymentMethod>(PaymentMethod.bankCard);
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
    if (!promoCodeStatus.isApplied) {
      return isFullPricePayment ? packageDetails.price : paymentAmount;
    }

    const totalPrice = packageDetails.price;
    const userInput = isFullPricePayment ? totalPrice : paymentAmount;
    const discount = promoCodeStatus.discount;
    const finalAmount = promoCodeStatus.finalAmount;

    // Case 1: User input equals total price (full payment)
    if (userInput === totalPrice) {
      return finalAmount;
    }

    // Case 2: User input is different from total price (partial payment)
    const remainder = totalPrice - userInput;

    // Case 2a: Remainder <= discount / 2
    // Apply full discount to first payment (single payment)
    if (remainder <= discount / 2) {
      return finalAmount;
    }

    // Case 2b: Remainder > discount / 2
    // Apply half discount to first payment, half to second payment
    const halfDiscount = discount / 2;
    return userInput - halfDiscount;
  }, [
    promoCodeStatus.isApplied,
    promoCodeStatus.discount,
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
            handlePay(method);
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
        packageDetails?.destinationFlight?.id && packageDetails?.returnFlight.id
      ),
    [packageDetails?.destinationFlight?.id, packageDetails?.returnFlight?.id],
  );

  const { data: roomTypes = [] } = useDictionary(
    "RoomTypeDictionary" as DictionaryTypes.RoomTypeDictionary,
    {
      enabled: !isHotelPackage,
    },
  );

  const handleLogPurchaseEvent = (amount: number) => {
    metaEvents.purchase({
      content_type: isHotelPackage ? "hotel" : "package",
      value: amount,
      currency: packageDetails.currency,
      offer_id: packageDetails.offerId,
      hotel_id: packageDetails.hotel.id,
      destination: packageDetails.city.nameEng,
      checkin_date: packageDetails.checkin,
      checkout_date: packageDetails.checkout,
      num_nights: packageDetails.nights,
      num_adults: travelers?.adults.length || 0,
      num_children: travelers?.children.length || 0,
      room_type: roomTypes.find(
        ({ key }: any) => key === packageDetails.roomType,
      )?.value,
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

  const handleLogPaymentInfoEvent = (paymentMethod?: PaymentMethod) => {
    const amount = isFullPricePayment ? packageDetails.price : paymentAmount;

    metaEvents.addPaymentInfo({
      content_type: isHotelPackage ? "hotel" : "package",
      value: amount,
      currency: packageDetails.currency,
      payment_type: paymentMethod ?? selectedPaymentMethod,
      hotel_id: packageDetails.hotel.id,
      destination: packageDetails.city.nameEng,
      checkin_date: packageDetails.checkin,
      checkout_date: packageDetails.checkout,
      room_type: roomTypes.find(
        ({ key }: any) => key === packageDetails.roomType,
      )?.value,
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
