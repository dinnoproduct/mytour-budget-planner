import { useEffect } from 'react'
import { Flex, Box } from '@chakra-ui/react'
import { PageLayout } from '@/shared/ui/layout/PageLayout'
import { Button, Illustration, Text } from '@ui'
import { useTranslation } from 'react-i18next'
import { useLanguageNavigate } from '@/hooks/useLanguageNavigate'
import { useQueryParams } from '@/hooks/useQueryParams'
import { BookingSuccessPage } from '../BookingSuccessPage'
import { BookingErrorPage } from '@/pages/BookingErrorPage'

export const BookingResultPage = () => {
  const { t } = useTranslation()
  const { navigateToMyPackages } = useLanguageNavigate()
  const { searchParams } = useQueryParams()

  const isSuccess = searchParams.success === 'true' || searchParams.success === 'True'
  const isError = searchParams.error === 'true' || searchParams.error === 'True'

  useEffect(() => {
    // If neither success nor error params are present, redirect to home or my packages
    if (!isSuccess && !isError) {
      navigateToMyPackages({ replace: true })
    }
  }, [isSuccess, isError, navigateToMyPackages])

  const handleGoToMyPackages = () => {
    if (isError) {
      navigateToMyPackages({ queryParams: 'tab=1' })
    } else {
      navigateToMyPackages()
    }
  }

  // Don't render if no valid params
  if (!isSuccess && !isError) {
    return null
  }

  return (
    <PageLayout background='white' showFooter={false}>
      {
        isSuccess ? (<BookingSuccessPage />) : (<BookingErrorPage />) 
      }
     </PageLayout>
  )
}


