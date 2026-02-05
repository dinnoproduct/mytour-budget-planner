import { Box, Flex, VStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Button, Illustration, Text } from '@ui'

type BookingSuccessViewProps = {
  onGoToMyPackages: () => void
}

export const BookingSuccessView = ({ onGoToMyPackages }: BookingSuccessViewProps) => {
  const { t } = useTranslation()

  return (
    <Flex
      direction="column"
      justify="space-between"
      width="full"
      maxW="container.lg"
      mx="auto"
      px={4}
      py={10}
    >
      <VStack spacing="4" flex="1" justify="center">
        <Illustration name="success" />
        <Text size="sm" mt="4" align="center">
          {t`paymentSuccessModalText`}
        </Text>
      </VStack>

      <Box p="4" width="full" borderTop="1px solid" borderColor="gray.100" mt="auto">
        <Button
          variant="solid-blue"
          size="lg"
          width="full"
          onClick={onGoToMyPackages}
        >
          {t`myPackages`}
        </Button>
      </Box>
    </Flex>
  )
}
