import { Text } from '@shared/ui'
import { Flex, type FlexProps } from '@chakra-ui/react'

export const NewBadge = (props: FlexProps) => (
  <Layout {...props} bgColor="red.500">
    NEW
  </Layout>
)

const Layout = ({ children, ...props }: FlexProps) => (
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
      {children}
    </Text>
  </Flex>
)
