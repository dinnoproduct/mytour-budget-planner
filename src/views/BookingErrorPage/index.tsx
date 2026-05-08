"use client"

import { Flex, Box } from '@chakra-ui/react'
import { PageLayout } from '@/shared/ui/layout/PageLayout'
import { Button, Illustration, Text } from '@ui'
import { useTranslation } from 'react-i18next'
import { useLanguageNavigate } from '@/hooks/useLanguageNavigate'

const SUPPORT_PHONE = '+37433320050'

export const BookingErrorPage = () => {
  const { t } = useTranslation()
  const { navigateToMyPackages } = useLanguageNavigate()

  const handleGoToMyPackages = () => {
    navigateToMyPackages({ queryParams: 'tab=1' })
  }

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
          <Illustration name="error" />
          <Text size="sm" mt="4" align="center">
            {t`paymentFailedErrorMessage`}
          </Text>
        </Flex>
      </Flex>

      <Box
        p="4"
        width="full"
        borderTop={{base: "1px solid", md: "none"}}
        borderColor={{base: "gray.100", md: "transparent"}}
        backgroundColor="white"
        display={{base: 'block', md: 'none'}}
        position={{ base: 'fixed', md: 'relative' }}
        bottom={{ base: 0, md: 'auto' }}
        left={{ base: 0, md: 'auto' }}
        right={{ base: 0, md: 'auto' }}
        zIndex={{ base: 10, md: undefined }}
      >
        <Flex
          direction="column"
          gap="3"
          width="full"
        >
          <Button
            variant="solid-blue"
            size="lg"
            width="full"
            href={`tel:${SUPPORT_PHONE}`}
          >
            {t`call`}
          </Button>
        </Flex>
      </Box>
    </>
  )
}
