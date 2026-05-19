import { Button, Heading, Text } from '@/shared/ui'
import { Box, Flex, Img, type LinkBoxProps } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

export const AboutUsBanner = (props: LinkBoxProps) => {
  const { t } = useTranslation()

  return (
    <Box
      mt={{ base: '168px', md: '170px' }}
      mb={{ base: '60px', md: '80px' }}
      height={{
        smd: '304',
        lg: '312px'
      }}
      bgColor="blue.50"
      bgImage={{
        base: 'none',
        smd: 'url(/assets/images/about-us-banner/about-us-banner-md.jpg)',
        lg: 'url(/assets/images/about-us-banner/about-us-banner-lg.jpg)'
      }}
      bgPosition="right"
      bgSize="cover"
      bgRepeat="no-repeat"
      {...props}
    >
      <Flex
        height="full"
        align={{ base: 'start', smd: 'center' }}
        direction={{ base: 'column', smd: 'row' }}
      >
        <Flex
          direction="column"
          maxWidth={{ base: 'full', smd: '537px' }}
          width="full"
          px={{ base: 5, smd: 10 }}
          py={{ base: 10, smd: 0 }}
        >
          <Heading
            fontSize={{
              base: 'text-lg',
              md: 'heading-sm-lg'
            }}
            lineHeight={{
              base: 'text-lg',
              md: 'heading-sm-lg'
            }}
            as="h2"
          >
            {t`aboutUs.mainText`}
          </Heading>

          <Text size={{ base: 'sm', md: 'md' }} mt="4">
            {t`aboutUs.subText`}
          </Text>

          <Button
            size="lg"
            variant="solid-blue"
            mt="8"
            width="fit-content"
            href="https://www.mytourpackages.am/team"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t`aboutUs.buttonLabel`}
          </Button>
        </Flex>

        <Img
          src="/assets/images/about-us-banner/about-us-banner-sm.jpg"
          alt="About Us Banner"
          display={{ base: 'block', smd: 'none' }}
          width="full"
          maxWidth="full"
          height="auto"
          objectFit="contain"
        />
      </Flex>
    </Box>
  )
}
