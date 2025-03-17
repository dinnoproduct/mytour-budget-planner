import {
  Box,
  Flex,
  HStack,
  ListItem,
  UnorderedList,
  Link
} from '@chakra-ui/react'
import { type ReactNode } from 'react'
import { SOCIALS } from './data'
import { Icon, Text } from '@ui'
import { useTranslation } from 'react-i18next'

export const Footer = () => (
  <Layout>
    <Flex direction={{ base: 'column', md: 'row' }}>
      <Contact />
    </Flex>
    <CopyRight />
  </Layout>
)

const Contact = () => {
  const { t } = useTranslation()

  return (
    <Flex direction="column" maxWidth="400px" width="full" flexShrink={0}>
      <HStack spacing="4" mb="4">
        {SOCIALS.map(social => (
          <Link key={social.icon} href={social.link} isExternal>
            <Icon name={social.icon} size="32" color="gray.600" />
          </Link>
        ))}
      </HStack>

      <UnorderedList listStyleType="none" spacing="2" mx="0">
        <ListItem>
          <Text
            size="md"
            color="gray.600"
            as="a"
            href="mailto:bookings@mytour.am"
          >
            bookings@mytour.am
          </Text>
        </ListItem>
        <ListItem>
          <Text size="md" color="gray.600" as="a" href="tel:+37433320050">
            +374 33 32 00 50
          </Text>
        </ListItem>
        <ListItem>
          <Text size="md" color="gray.600">
            {t`officeAddress`}
          </Text>
        </ListItem>
      </UnorderedList>
    </Flex>
  )
}

const AboutUs = () => {
  const { t } = useTranslation()

  return (
    <Box mt={{ base: 10, md: 0 }} ml={{ md: '60px' }} flexShrink={0}>
      <ItemsList items={[t`aboutUs`, t`termsAndConditions`]} />
    </Box>
  )
}

const CopyRight = () => (
  <Box mt={{ base: 10, md: 0 }}>
    <ItemsList items={['© 2024 MyTour']} />
  </Box>
)

const ItemsList = ({ items }: { items: string[] }) => (
  <UnorderedList listStyleType="none" spacing="2" mx="0">
    {items.map(item => (
      <ListItem key={item}>
        <Text size="md" color="gray.600">
          {item}
        </Text>
      </ListItem>
    ))}
  </UnorderedList>
)

const Layout = ({ children }: { children: ReactNode | ReactNode[] }) => (
  <Box as="footer" bgColor="white" borderTop="1px solid" borderColor="gray.100">
    <Flex
      px={{ base: 4, md: 6 }}
      py="10"
      direction={{ base: 'column', lg: 'row' }}
      justify={{ lg: 'space-between' }}
      width="full"
    >
      {children}
    </Flex>
  </Box>
)
