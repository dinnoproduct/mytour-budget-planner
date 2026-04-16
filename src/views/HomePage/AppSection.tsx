import { useTranslation } from 'react-i18next'
import { Box, Flex, HStack, Image, Link } from '@chakra-ui/react'
import { Text } from '@ui'

export const AppSection = () => {
  const { t } = useTranslation()

  return (
    <Box
      height={{ base: '400px', md: '380px' }}
      bgColor="gray.100"
      pt={{ base: 10, md: 0 }}
      pr={{ base: 4, md: '10' }}
      pl={{ base: 4, md: '10' }}
      mt={{ base: '60px', md: '20' }}
    >
      <Flex
        direction={{ base: 'column-reverse', sm: 'row' }}
        maxHeight="full"
        height="full"
        justify={{ sm: 'center' }}
      >
        <Box mt={{ base: '6', sm: 0 }}>
          <Image
            src="/assets/images/app-phone.png"
            alt="MyTour"
            height={{ base: '292px', sm: '450px' }}
            maxWidth="full"
            mb={{ base: '-56px', sm: 0 }}
            transform={{
              sm: 'translateY(30px)'
            }}
          />
        </Box>

        <Flex
          width={{ base: 'full', sm: '578px' }}
          direction="column"
          height="full"
          justify={{ md: 'center' }}
        >
          <Text
            size={{
              base: 'lg',
              sm: '3xl'
            }}
          >{t`myTourApp`}</Text>

          <HStack spacing="6" mt="6">
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
        </Flex>
      </Flex>
    </Box>
  )
}
