import { getPluralForm } from '@/shared/helpers'
import { Flex, Text, Button } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

type FooterProps = {
  day: string
  month: string
  onConfirm: () => void
}

export function Footer({ day, month, onConfirm }: Readonly<FooterProps>) {
  const { t } = useTranslation()

  return (
    <Flex
      textAlign="right"
      height="112px"
      flexDirection="column"
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
      <Text fontWeight="500" size="sm" color="gray.800">
        {t(getPluralForm(Number(day), 'staySummary'), {
          day,
          month: t(month.toLowerCase()).toLowerCase()
        })}
      </Text>

      <Button variant="solid-blue" width="full" onClick={onConfirm} mt="3">
        {t`confirm`}
      </Button>
    </Flex>
  )
}
