import { Button, Illustration, Text } from '@ui'
import { useTranslation } from 'react-i18next'
import { Box, Flex, VStack } from '@chakra-ui/react'

type PaymentErrorViewProps = {
  onGoToMyPackages?: () => void
}

export const PaymentErrorView = ({ onGoToMyPackages }: PaymentErrorViewProps) => {
  const { t } = useTranslation()

  return (
    <Flex direction="column" justify="space-between" width="full" height="full">
      <VStack
        spacing="4"
        py="10"
        px="4"
        mx="auto"
        overflowY="scroll"
        width="full"
        height={{ base: 'calc(100dvh - 160px)', md: 'auto' }}
        maxWidth="402px"
        sx={{
          '&::-webkit-scrollbar': {
            width: '0'
          }
        }}
      >
        <Illustration name="error" />

        <Text size="sm" align="center">
          {t`paymentFailedErrorMessage`}
        </Text>
      </VStack>

      <Box
        p="4"
        width="full"
        borderTop="1px solid"
        borderColor="gray.100"
        backgroundColor="white"
        mt="auto"
      >
        {onGoToMyPackages ? (
          <Button
            variant="solid-blue"
            size="lg"
            width="full"
            onClick={onGoToMyPackages}
          >
            {t`myPackages`}
          </Button>
        ) : (
          <Box display={{ base: 'block', md: 'none' }}>
            <Button
              variant="solid-blue"
              type="submit"
              size="lg"
              width="full"
              href="tel:+37493240732"
            >
              {t`call`}
            </Button>
          </Box>
        )}
      </Box>
    </Flex>
  )
}
