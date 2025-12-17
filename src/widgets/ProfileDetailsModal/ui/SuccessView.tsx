import { Illustration, Text } from '@ui'
import { Flex } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

export const SuccessView = () => {
  const { t } = useTranslation()

  return (
    <Flex
      width="full"
      py="10"
      // px="4"
      overflowY="scroll"
      height={{ base: 'calc(100dvh - 80px)', md: 'calc(306px - 80px)' }}
      direction="column"
      maxWidth="402px"
      mx="auto"
      align="center"
      sx={{
        '&::-webkit-scrollbar': {
          width: '0'
        }
      }}
    >
      <Illustration name="success" />

      <Text size="sm" mt="6px" align="center">
        {t`personalInformationUpdated`}
      </Text>
    </Flex>
  )
}
