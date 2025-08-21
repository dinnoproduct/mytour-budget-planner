import {
  Box,
  Flex,
  HStack,
  ListItem,
  UnorderedList,
  Link, Image
} from '@chakra-ui/react'
import { type ReactNode } from 'react'
import { SOCIALS } from './data'
import { Text } from '@ui'
import { useTranslation } from 'react-i18next'

export const Footer = () => (
  <Layout>
    <Flex direction={{ base: 'column', md: 'row' }} width='full' justify={{ lg: 'space-between' }} gap='6'>
      <Contact />
      <FollowUs />
      {/*<Support />*/}
      <AppSection />
    </Flex>
  </Layout>
)

const Contact = () => {
  const { t } = useTranslation()

  return (
    <Flex direction="column" maxWidth="400px" width="full" >
      <Text size="md" color="gray.700" fontWeight={700} mb={3}>
        {t`contact`}
      </Text>
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

const FollowUs = () => {
  const { t } = useTranslation()

  return (
    <Flex direction="column" maxWidth="400px" width="full" >
      <Text size="md" color="gray.700" fontWeight={700} mb={3}>
        {t`followUs`}
      </Text>
      <UnorderedList listStyleType="none" spacing="2" mx="0">
        {SOCIALS.map((social) => (
          <ListItem>
            <Link key={social.icon} href={social.link} isExternal>
              <Text
                size="md"
                color="gray.600"
                textTransform="capitalize"
              >
                {social.icon}
              </Text>
            </Link>
          </ListItem>
        ))}
      </UnorderedList>
    </Flex>
  )
}

const Support = () => {
  const { t } = useTranslation()

  return (
    <Flex direction="column" maxWidth="400px" width="full" >
      <Text size="md" color="gray.700" fontWeight={700} mb={3}>
        {t`support`}
      </Text>
      <UnorderedList listStyleType="none" spacing="2" mx="0">
        <ListItem>
          <Text
            size="md"
            color="gray.600"
          >
            FAQ
          </Text>
        </ListItem>
        <ListItem>
          <Text size="md" color="gray.600">
            {t`privacyPolicy`}
          </Text>
        </ListItem>
        <ListItem>
          <Text size="md" color="gray.600">
            {t`termsAndConditions`}
          </Text>
        </ListItem>
      </UnorderedList>
    </Flex>
  )
}
const AppSection = () => {
  const { t } = useTranslation()

  return (
    <Flex
      width={{ base: 'full', sm: '578px' }}
      mt={{ base: '5', md: '0' }}
      direction="column"
      height="full"
      justify={{ md: 'center' }}
    >
      <Text size="md" color="gray.700" fontWeight={700} mb={3}>{t`myTourApp`}</Text>

      <HStack spacing="4" mt="5">
        <Link
          isExternal
          href="https://apps.apple.com/am/app/my-ameria/id1546373103"
        >
          <Image src="/assets/images/app-store.svg" alt="App Store" />
        </Link>

        <Link
          isExternal
          href="https://play.google.com/store/apps/details?id=com.banqr.ameriabank&hl=en"
        >
          <Image src="/assets/images/google-play.svg" alt="Google Play" />
        </Link>
      </HStack>

      <CopyRight />
    </Flex>
  )
}

const CopyRight = () => (
  <Box mt='5'>
    <ItemsList items={[`© ${new Date().getFullYear()} MyTour`]} />
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
      px={{ base: 4, md: 10 }}
      py="10"
      direction={{ base: 'column', lg: 'row' }}
      width="full"
    >
      {children}
    </Flex>
  </Box>
)
