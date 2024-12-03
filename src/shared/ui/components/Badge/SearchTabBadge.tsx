import { Text } from '@shared/ui'
import { Flex, type FlexProps } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

export const NewBadge = (props: FlexProps) => (
  <Layout {...props} bgColor="red.500" label="new" />
)

export const SoonBadge = (props: FlexProps) => (
  <Layout {...props} bgColor="teal.400" label="soon" />
)

const Layout = ({ label, ...props }: FlexProps & { label: string }) => {
  const { t } = useTranslation()

  return (
    <Flex
      px="6px"
      height="16px"
      rounded="full"
      align="center"
      justify="center"
      {...props}
    >
      <Text
        size="xs"
        color="white"
        fontWeight="medium"
        fontSize="8px"
        lineHeight="8px"
      >
        {t(label)}
      </Text>
    </Flex>
  )
}
