import { useEffect } from 'react'
import { Flex } from '@chakra-ui/react'
import { PageLayout } from '@/shared/ui/layout/PageLayout'
import { BookingFlow } from '@/widgets/BookingFlow/ui'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { bookingContextAtom } from '@/modules/packages/store/store'
import { useLanguageNavigate } from '@/hooks/useLanguageNavigate'
import Loader from '@/components/Loader/Loader'

export const BookingPage = () => {
  const { navigateToMyPackages, navigateBack } = useLanguageNavigate()
  const bookingContext = useRecoilValue(bookingContextAtom)
  const setBookingContext = useSetRecoilState(bookingContextAtom)

  useEffect(() => {
    if (!bookingContext) {
      navigateToMyPackages({ queryParams: 'tab=1', replace: true })
    }
  }, [bookingContext, navigateToMyPackages])

  const handleGoToMyPackages = () => {
    setBookingContext(null)
    navigateToMyPackages({ queryParams: 'tab=1' })
  }

  if (!bookingContext) {
    return <Loader loading />
  }

  return (
    <PageLayout background='white' showFooter={false}>
      <Flex flex={1} minH={0} direction="column" width="full">
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
      </Flex>
    </PageLayout>
  )
}
