import { getPluralForm } from '@/shared/helpers'
import { Flex, Text, Button } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

type FooterProps = {
  night: string
  month: string
  onConfirm: () => void
}

export function Footer({ night, month, onConfirm }: Readonly<FooterProps>) {
  const { t } = useTranslation()

  return (
    <Flex
      mt={7}
      textAlign="right"
      height="110px"
      flexDirection="column"
      gap={3}
      width="full"
      align="center"
      p={4}
      justify="flex-end"
      borderTop="1px solid"
      borderColor="gray.100"
      position={{ base: 'fixed', md: 'static' }}
      bottom={{ base: 0, md: undefined }}
      bgColor="white"
    >
      <Text fontWeight="500">
        {t(getPluralForm(Number(night), 'staySummary'), {
          day: night,
          month: t(month.toLowerCase()).toLowerCase()
        })}
      </Text>
      <Button variant="solid-blue" width="full" onClick={onConfirm}>
        {t`confirm`}
      </Button>
    </Flex>
  )
}
