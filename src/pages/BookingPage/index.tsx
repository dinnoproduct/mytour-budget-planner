import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { PageLayout } from '@/shared/ui/layout/PageLayout'
import { BookingFlow } from '@/widgets/BookingFlow/ui'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { bookingContextAtom } from '@/modules/packages/store/store'
import { useLanguageNavigate } from '@/hooks/useLanguageNavigate'
import Loader from '@/components/Loader/Loader'
import { BookingSuccessView } from '@/widgets/BookingFlow/ui/BookingSuccessView'
import { PaymentErrorView } from '@/widgets/BookingFlow/ui/PaymentModal/PaymentErrorView'

export const BookingPage = () => {
  const location = useLocation()
  const { navigateToMyPackages, navigateBack } = useLanguageNavigate()
  const bookingContext = useRecoilValue(bookingContextAtom)
  const setBookingContext = useSetRecoilState(bookingContextAtom)

  const searchParams = new URLSearchParams(location.search)
  const successParam = searchParams.get('success')?.toLowerCase()
  const isReturnFromPayment = successParam === 'true' || successParam === 'false'
  const isPaymentSuccess = successParam === 'true'

  useEffect(() => {
    if (!bookingContext && !isReturnFromPayment) {
      navigateToMyPackages({ queryParams: 'tab=1', replace: true })
    }
  }, [bookingContext, isReturnFromPayment, navigateToMyPackages])

  const handleGoToMyPackages = () => {
    setBookingContext(null)
    navigateToMyPackages({ queryParams: 'tab=1' })
  }

  if (!bookingContext && !isReturnFromPayment) {
    return <Loader loading />
  }

  if (!bookingContext && isReturnFromPayment) {
    return (
      <PageLayout background="white" showFooter={false}>
        {isPaymentSuccess ? (
          <BookingSuccessView onGoToMyPackages={handleGoToMyPackages} />
        ) : (
          <PaymentErrorView onGoToMyPackages={handleGoToMyPackages} />
        )}
      </PageLayout>
    )
  }

  if (!bookingContext) {
    return null
  }

  return (
    <PageLayout background='white' showFooter={false}>
      <BookingFlow
        packageDetails={bookingContext.packageDetails}
        initialView={bookingContext.initialView}
        childrenAges={bookingContext.childrenAges}
        isOpen={true}
        onClose={() => {
          setBookingContext(null)
          navigateBack()
        }}
        request={bookingContext.request}
        defaultTravelers={bookingContext.defaultTravelers}
        isBooked={bookingContext.isBooked}
        renderAsPage={true}
        onNavigateToMyPackages={handleGoToMyPackages}
      />
    </PageLayout>
  )
}
