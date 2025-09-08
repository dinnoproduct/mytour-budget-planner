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
import { PaymentFormView } from "@widgets/BookingFlow/ui/PaymentModal/PaymentFormView.tsx";
import { PaymentErrorView } from "@widgets/BookingFlow/ui/PaymentModal/PaymentErrorView.tsx";
import { PaymentMethodView } from "@widgets/BookingFlow/ui/PaymentModal/PaymentMethodView.tsx";
import { AmeriaPayView } from "@widgets/BookingFlow/ui/PaymentModal/AmeriaPayView.tsx";
import {
  DictionaryTypes,
  useDictionary,
  type PaymentSystem,
} from "@entities/package";
import { PreviewDetailsView } from "@widgets/BookingFlow/ui/PaymentModal/PreviewDetailsView.tsx";
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
}: PaymentModalProps) => {
  const { t } = useTranslation();
  const isFullPricePayment = useMemo(
    () => prepaymentInfo?.paymentType === "FullPricePayment",
    [prepaymentInfo?.paymentType],
  );
  const [activeView, setActiveView] = useState<PaymentModalView>(
    view || "paymentForm",
  );
  const [ameriaPayUrl, setAmeriaPayUrl] = useState<string>("");
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentOption, setPaymentOption] = useState<PaymentOption>("pay");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);

  const ViewComponent = useMemo(() => {
    const ViewComponentMap = {
      paymentMethod: () => (
        <PaymentMethodView
          onSubmit={handlePaymentMethodSelect}
          isLoadingBooking={isLoadingBooking}
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
        />
      ),
      paymentError: () => <PaymentErrorView />,
      previewDetails: () => (
        <PreviewDetailsView
          onPay={handlePay}
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
    paymentOption,
    prepaymentInfo,
  ]);

  useEffect(() => {
    if (isFullPricePayment && view === "paymentForm") {
      setActiveView("paymentMethod");
    } else if (view) {
      setActiveView(view);
    }
  }, [view, isFullPricePayment]);

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

  const handlePay = async () => {
    const amount = isFullPricePayment ? packageDetails.price : paymentAmount;
    try {
      metaEvents.purchase({
        content_type: isHotelPackage ? "hotel" : "package",
        content_ids: ["hotel_547"], // TODO: add content_ids
        value: amount,
        currency: packageDetails.currency,
        order_id: packageDetails.offerId, // TODO: check and add order_id
        hotel_id: packageDetails.hotel.id,
        destination: packageDetails.city.nameEng,
        checkin_date: packageDetails.checkin,
        checkout_date: packageDetails.checkout,
        num_nights: packageDetails.nights,
        num_adults: travelers?.adults.length || 0,
        num_children: travelers?.children.length || 0,
        num_rooms: 1, // TODO: add num_rooms
        room_type: roomTypes.find(
          ({ key }: any) => key === packageDetails.roomType,
        )?.value,
      });
      handleLogEvent({ name: BookingStep.PaymentMethodSelected, number: 3 });
      if (selectedPaymentMethod === PaymentMethod.ameriaPay && onSuccess) {
        const url = await onSuccess(
          amount,
          "MyAmeriaPay" as PaymentSystem.MyAmeriaPay,
        );

        if (url) {
          setAmeriaPayUrl(url);
          setActiveView("ameriaPay");
        }
      } else if (selectedPaymentMethod === PaymentMethod.bankCard) {
        await onSuccess(amount, "VPos" as PaymentSystem.VPos);
      }
    } catch (error) {
      setActiveView("paymentError");
    }
  };

  const handlePaymentMethodSelect = (paymentMethod: PaymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
    setActiveView("previewDetails");
    const amount = isFullPricePayment ? packageDetails.price : paymentAmount;

    metaEvents.addPaymentInfo({
      content_type: isHotelPackage ? "hotel" : "package",
      content_ids: ["hotel_547"], // TODO: add content_ids
      value: amount,
      currency: packageDetails.currency,
      payment_type: selectedPaymentMethod,
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

    if (paymentOption === "pay") {
      setPaymentAmount(amount);
      setActiveView("paymentMethod");
    } else if (paymentOption === "noPrepayment") {
      setPaymentAmount(0);
      handlePaymentMethodSelect(PaymentMethod.bankCard);
    }
  };

  const handleBackClick = useMemo(() => {
    if (activeView === "paymentMethod") {
      return () => setActiveView("paymentForm");
    } else if (activeView === "previewDetails") {
      return () => setActiveView("paymentMethod");
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
    >
      <ViewComponent />
    </Layout>
  );
};
