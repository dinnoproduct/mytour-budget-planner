"use client"

import { Flex, Box } from '@chakra-ui/react'
import { PageLayout } from '@/shared/ui/layout/PageLayout'
import { Button, Illustration, Text } from '@ui'
import { useTranslation } from 'react-i18next'
import { useLanguageNavigate } from '@/hooks/useLanguageNavigate'

type BookingSuccessPageProps = {
  /** When true, show paymentSuccessModalText; when false, show bookingSuccessModalText */
  fromPayment?: boolean
}

export const BookingSuccessPage = ({ fromPayment = false }: BookingSuccessPageProps) => {
  const { t } = useTranslation()
  const { navigateToMyPackages } = useLanguageNavigate()

  const handleGoToMyPackages = () => {
    navigateToMyPackages()
  }

  const successMessage = fromPayment ? t('paymentSuccessModalText') : t('bookingSuccessModalText')

  return (
    <>
      <Flex 
        flex={1} 
        minH={0} 
        direction="column" 
        width="full"
        align="center"
        justify="flex-start"
        py={{ base: "10", md: "16" }}
        px="4"
        pb={{ base: "24", md: "16" }}
      >
        <Flex
          direction="column"
          align="center"
          justify="center"
          width="full"
          maxW="500px"
          mx="auto"
        >
          <Illustration name="success" />
          <Text size="sm" mt="4" align="center">
            {successMessage}
          </Text>
          <Button
            mt="6"
            variant="solid-blue"
            size="lg"
            width={{base: 'full', md: 'auto'}}
            onClick={handleGoToMyPackages}
            display={{ base: 'none', md: 'block' }}
          >
            {t`myPackages`}
          </Button>
        </Flex>
      </Flex>

      <Box
        p="4"
        width="full"
        borderTop={{base: "1px solid", md: "none"}}
        borderColor={{base: "gray.100", md: "transparent"}}
        backgroundColor="white"
        position={{ base: 'fixed', md: 'relative' }}
        bottom={{ base: 0, md: 'auto' }}
        left={{ base: 0, md: 'auto' }}
        right={{ base: 0, md: 'auto' }}
        zIndex={{ base: 10, md: undefined }}
      >
        <Button
          variant="solid-blue"
          size="lg"
          width="full"
          onClick={handleGoToMyPackages}
          display={{ base: 'block', md: 'none' }}
        >
          {t`myPackages`}
        </Button>
      </Box>
    </>
  )
}
