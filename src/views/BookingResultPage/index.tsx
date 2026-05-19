"use client"

import { useEffect } from 'react'
import { Flex, Box } from '@chakra-ui/react'
import { PageLayout } from '@/shared/ui/layout/PageLayout'
import { Button, Illustration, Text } from '@ui'
import { useTranslation } from 'react-i18next'
import { useLanguageNavigate } from '@/hooks/useLanguageNavigate'
import { useQueryParams } from '@/hooks/useQueryParams'
import { BookingSuccessPage } from '../BookingSuccessPage'
import { BookingErrorPage } from '@pages/BookingErrorPage'

export const BookingResultPage = () => {
  const { t } = useTranslation()
  const { navigateToMyPackages } = useLanguageNavigate()
  const { searchParams } = useQueryParams()

  const successParam = searchParams.success
  const normalizedSuccess = typeof successParam === 'string' ? successParam.toLowerCase() : undefined
  const hasSuccessFlag = normalizedSuccess === 'true' || normalizedSuccess === 'false'
  const isSuccess = normalizedSuccess === 'true'

  // Same page, two messages: from localStorage (or URL) — booking flow → bookingSuccessModalText, payment flow → paymentSuccessModalText
  const fromPaymentFromUrl = searchParams.fromPayment === 'true' || searchParams.fromPayment === 'True'
  const fromPaymentFromStorage =
    typeof window !== 'undefined' &&
    localStorage.getItem('bookingResultSource') === 'payment'
  const fromPayment = fromPaymentFromStorage || fromPaymentFromUrl

  useEffect(() => {
    // If success flag is missing, redirect to my packages
    if (!hasSuccessFlag) {
      navigateToMyPackages({ replace: true })
    }
  }, [hasSuccessFlag, navigateToMyPackages])

  // Don't render if no valid params
  if (!hasSuccessFlag) {
    return null
  }

  return (
    <PageLayout background='white' showFooter={false}>
      {
        isSuccess ? (
          <BookingSuccessPage fromPayment={fromPayment} />
        ) : (
          <BookingErrorPage />
        )
      }
     </PageLayout>
  )
}


