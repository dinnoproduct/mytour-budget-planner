import { Layout } from './Layout.tsx'
import {
  PaymentMethod,
  type PaymentModalProps,
  type PaymentModalView,
  type PaymentOption,
  VIEW_CONTENT_MAP
} from './types.ts'
import { useTranslation } from 'react-i18next'
import { useEffect, useMemo, useState } from 'react'
import { PaymentFormView } from '@widgets/BookingFlow/ui/PaymentModal/PaymentFormView.tsx'
import { PaymentErrorView } from '@widgets/BookingFlow/ui/PaymentModal/PaymentErrorView.tsx'
import { PaymentMethodView } from '@widgets/BookingFlow/ui/PaymentModal/PaymentMethodView.tsx'
import { AmeriaPayView } from '@widgets/BookingFlow/ui/PaymentModal/AmeriaPayView.tsx'
import { type PaymentSystem } from '@entities/package'
import { PreviewDetailsView } from '@widgets/BookingFlow/ui/PaymentModal/PreviewDetailsView.tsx'

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
  isLateCheckout,
  travelers,
  validatePromoCode
}: PaymentModalProps) => {
  const { t } = useTranslation()
  const isFullPricePayment = useMemo(
    () => prepaymentInfo?.paymentType === 'FullPricePayment',
    [prepaymentInfo?.paymentType]
  )
  const [activeView, setActiveView] = useState<PaymentModalView>(
    view || 'paymentForm'
  )
  const [ameriaPayUrl, setAmeriaPayUrl] = useState<string>('')
  const [paymentAmount, setPaymentAmount] = useState<number>(0)
  const [paymentOption, setPaymentOption] = useState<PaymentOption>('pay')
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null)

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
          travelers={travelers || {adults: [], children: []}}
          paymentAmount={isFullPricePayment ? packageDetails.price : paymentAmount}
          isFullPricePayment={isFullPricePayment}
          prepaymentInfo={prepaymentInfo}
          validatePromoCode={validatePromoCode}
        />
      )
    }

    return ViewComponentMap[activeView]
  }, [
    activeView,
    ameriaPayUrl,
    packageDetails,
    isLoadingBooking,
    isBooked,
    paymentOption,
    prepaymentInfo
  ])

  useEffect(() => {
    if (isFullPricePayment && view === 'paymentForm') {
      setActiveView('paymentMethod')
    } else if (view) {
      setActiveView(view)
    }
  }, [view, isFullPricePayment])

  const handlePay = async () => {
    const amount = isFullPricePayment ? packageDetails.price : paymentAmount

    try {
      if (selectedPaymentMethod === PaymentMethod.ameriaPay && onSuccess) {
        const url = await onSuccess(
          amount,
          'MyAmeriaPay' as PaymentSystem.MyAmeriaPay
        )

        if (url) {
          setAmeriaPayUrl(url)
          setActiveView('ameriaPay')
        }
      } else if (selectedPaymentMethod === PaymentMethod.bankCard) {
        await onSuccess(amount, 'VPos' as PaymentSystem.VPos)
      }
    } catch (error) {
      setActiveView('paymentError')
    }
  }

  const handlePaymentMethodSelect = (paymentMethod: PaymentMethod) => {
    setSelectedPaymentMethod(paymentMethod)
    setActiveView('previewDetails')
  }

  const handleContinue = (amount: number, paymentOption: PaymentOption) => {
    setPaymentOption(paymentOption)

    if (paymentOption === 'pay') {
      setPaymentAmount(amount)
      setActiveView('paymentMethod')
    } else if (paymentOption === 'noPrepayment') {
      setPaymentAmount(0)
      handlePaymentMethodSelect(PaymentMethod.bankCard)
    }
  }

  const handleBackClick = useMemo(() => {
    if (activeView === 'paymentMethod') {
      return () => setActiveView('paymentForm')
    } else if (activeView === 'previewDetails') {
      return () => setActiveView('paymentMethod')
    } else if (activeView === 'paymentForm' && onBackClick) {
      return () => onBackClick()
    }

    return undefined
  }, [activeView, onBackClick])

  return (
    <Layout
      title={t(VIEW_CONTENT_MAP[activeView].title)}
      isOpen={isOpen}
      closeModal={closeModal}
      onBackClick={handleBackClick}
    >
      <ViewComponent />
    </Layout>
  )
}
