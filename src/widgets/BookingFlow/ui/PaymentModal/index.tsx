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

export const PaymentModal = ({
  closeModal,
  onSuccess,
  onBackClick,
  packageDetails,
  isOpen = false,
  isLoadingBooking,
  view,
  isBooked
}: PaymentModalProps) => {
  const { t } = useTranslation()
  const isHotelPackage = useMemo(
    () => !packageDetails.destinationFlight?.id,
    [packageDetails.destinationFlight?.id]
  )
  const [activeView, setActiveView] = useState<PaymentModalView>(
    view || 'paymentForm'
  )
  const [ameriaPayUrl, setAmeriaPayUrl] = useState<string>('')
  const [paymentAmount, setPaymentAmount] = useState<number>(0)
  const [paymentOption, setPaymentOption] = useState<PaymentOption>('pay')

  const ViewComponent = useMemo(() => {
    const ViewComponentMap = {
      paymentMethod: () => <PaymentMethodView onSubmit={handlePay} />,
      ameriaPay: () => <AmeriaPayView paymentUrl={ameriaPayUrl} />,
      paymentForm: () => (
        <PaymentFormView
          onSubmit={handleContinue}
          packageDetails={packageDetails}
          isLoadingBooking={isLoadingBooking}
          initialPaymentOption={paymentOption}
          isBooked={isBooked}
        />
      ),
      paymentError: () => <PaymentErrorView />
    }

    return ViewComponentMap[activeView]
  }, [
    activeView,
    ameriaPayUrl,
    packageDetails,
    isLoadingBooking,
    isBooked,
    paymentOption
  ])

  useEffect(() => {
    if (isHotelPackage && view === 'paymentForm') {
      setActiveView('paymentMethod')
    } else if (view) {
      setActiveView(view)
    }
  }, [view, isHotelPackage])

  const handlePay = async (paymentMethod: PaymentMethod) => {
    const amount = isHotelPackage ? packageDetails.price : paymentAmount

    try {
      if (paymentMethod === PaymentMethod.ameriaPay && onSuccess) {
        const url = await onSuccess(
          amount,
          'MyAmeriaPay' as PaymentSystem.MyAmeriaPay
        )

        if (url) {
          setAmeriaPayUrl(url)
          setActiveView('ameriaPay')
        }
      } else if (paymentMethod === PaymentMethod.bankCard) {
        await onSuccess(amount, 'VPos' as PaymentSystem.VPos)
      }
    } catch (error) {
      setActiveView('paymentError')
    }
  }

  const handleContinue = (amount: number, paymentOption: PaymentOption) => {
    setPaymentOption(paymentOption)

    if (paymentOption === 'pay') {
      setPaymentAmount(amount)
      setActiveView('paymentMethod')
    } else if (paymentOption === 'noPrepayment') {
      setPaymentAmount(0)
      handlePay(PaymentMethod.bankCard)
    }
  }

  const handleBackClick = useMemo(() => {
    if (activeView === 'paymentMethod') {
      return () => setActiveView('paymentForm')
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
