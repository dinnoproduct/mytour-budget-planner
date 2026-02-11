import { Layout } from "./Layout.tsx";
import {
  PaymentMethod,
  type PaymentModalProps,
  type PaymentModalView,
  type PaymentOption,
  VIEW_CONTENT_MAP,
} from "./types.ts";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { PaymentFormView } from "@widgets/BookingFlow/ui/PaymentModal/PaymentFormView";
import { PaymentErrorView } from "@widgets/BookingFlow/ui/PaymentModal/PaymentErrorView.tsx";
import { PaymentMethodView } from "@widgets/BookingFlow/ui/PaymentModal/PaymentMethodView.tsx";
import { AmeriaPayView } from "@widgets/BookingFlow/ui/PaymentModal/AmeriaPayView.tsx";
import {
  DictionaryTypes,
  useDictionary,
  type PaymentSystem,
} from "@entities/package";
import { PreviewDetailsView } from "@/widgets/BookingFlow/ui/PaymentModal/PreviewDetailsView/index.tsx";
import { BookingStep, metaEvents } from "@/shared/configs/metaEvents.ts";

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
  onNavigateToMyPackages,
}: PaymentModalProps) => {
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState<PaymentModalView>(
    view || "paymentForm",
  );
  const [ameriaPayUrl, setAmeriaPayUrl] = useState<string>("");
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentOption, setPaymentOption] = useState<PaymentOption>("pay");
  const isFullPricePayment = useMemo(
    () =>
      paymentOption === "payFull" ||
      paymentAmount === packageDetails.price ||
      prepaymentInfo?.paymentType === "FullPricePayment",
    [paymentOption, paymentAmount, packageDetails.price, prepaymentInfo?.paymentType],
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);
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

  const ViewComponent = useMemo(() => {
    const ViewComponentMap = {
      paymentMethod: () => (
        <PaymentMethodView
          onSubmit={(method) => {
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
        />
      ),
      paymentError: () => (
        <PaymentErrorView
          onGoToMyPackages={renderAsPage ? onNavigateToMyPackages : undefined}
          renderAsPage={renderAsPage}
        />
      ),
      previewDetails: () => (
        <PreviewDetailsView
          onPay={() => setActiveView("paymentMethod")}
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
  ]);

  useEffect(() => {
    if (view) {
      setActiveView(view);
    }
  }, [view, isFullPricePayment]);

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

  const handlePay = async (paymentMethod: PaymentMethod) => {
    // Calculate the final amount after promo code discount using the promo code logic
    const amount = calculatePromoCodePaymentAmount;
    try {
      handleLogPurchaseEvent(amount);
      handleLogEvent({ name: BookingStep.TermsConfirmed, number: 4 });
      
      // Prepare promo code info to send to backend
      const promoCodeInfo = promoCodeStatus.isApplied
        ? {
            promoCode: promoCodeStatus.code,
            initialPrice: packageDetails.price,
            firstPaymentSum: amount,
          }
        : undefined;

      if (paymentMethod === PaymentMethod.ameriaPay && onSuccess) {
        const url = await onSuccess(
          amount,
          "MyAmeriaPay" as PaymentSystem.MyAmeriaPay,
          promoCodeInfo,
        );

        if (url) {
          setAmeriaPayUrl(url);
          setActiveView("ameriaPay");
        }
      } else if (paymentMethod === PaymentMethod.bankCard) {
        await onSuccess(amount, "VPos" as PaymentSystem.VPos, promoCodeInfo);
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
    >
      <ViewComponent />
    </Layout>
  );
};
