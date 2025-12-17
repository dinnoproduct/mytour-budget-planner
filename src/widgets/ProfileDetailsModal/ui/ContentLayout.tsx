import { Button } from '@ui'
import { Box, Flex, VStack } from '@chakra-ui/react'
import { type ContentLayoutProps } from './types'
import { useTranslation } from 'react-i18next'

export const ContentLayout = ({
  onSubmit,
  children,
  isLoading,
  isSubmitDisabled
}: ContentLayoutProps) => {
  const { t } = useTranslation()

  return (
    <Flex
      direction="column"
      justify="space-between"
      as="form"
      onSubmit={onSubmit}
      width="full"
      height="full"
    >
      <VStack
        spacing="6"
        py="6"
        px="4"
        mx="auto"
        overflowY="scroll"
        width="full"
        height={{ base: 'calc(100dvh - 162px)', md: 'calc(574px - 162px)' }}
        maxWidth="402px"
        sx={{
          '&::-webkit-scrollbar': {
            width: '0'
          }
        }}
      >
        {children}
      </VStack>

      <Box
        p="4"
        width="full"
        borderTop="1px solid"
        borderColor="gray.100"
        backgroundColor="white"
        mt="auto"
      >
        <Button
          variant="solid-blue"
          type="submit"
          size="lg"
          width="full"
          isLoading={isLoading}
          isDisabled={isSubmitDisabled}
        >
          {t`save`}
        </Button>
      </Box>
    </Flex>
  )
}
