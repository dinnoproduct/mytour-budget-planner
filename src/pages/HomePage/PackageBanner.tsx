import { Flex, LinkBox, type LinkBoxProps, LinkOverlay } from '@chakra-ui/react'
import { Button, Heading, Text } from '@ui'
import { useTranslation } from 'react-i18next'

export const PackageBanner = (props: LinkBoxProps) => {
  const { t } = useTranslation()

  return (
    <LinkBox
      height={{
        base: '440px', // height at base size
        // xs: '230px',
        sm: '296px',
        lg: '330px'
      }}
      rounded="2xl"
      bgColor="gray.50"
      mx={{ base: 4, md: 6 }}
      bgImage={{
        base: 'url(/assets/package-banner/package-banner-sm.jpg)',
        sm: 'url(/assets/package-banner/package-banner-lg.jpg)'
      }}
      bgSize="cover"
      bgPosition={{
        base: 'bottom',
        sm: 'right center'
      }}
      bgRepeat="no-repeat"
      {...props}
    >
      <Flex
        height="full"
        align={{ base: 'start', sm: 'center' }}
        px={{ base: 5, sm: 10 }}
        pt={{ base: 5, sm: 0 }}
      >
        <Flex
          direction="column"
          maxWidth={{
            base: 'full',
            // xs: '52%',
            sm: '53%',
            lg: '701px'
          }}
          width="full"
        >
          <Heading
            fontSize={{
              base: 'text-lg',
              sm: 'heading-sm-lg'
            }}
            lineHeight={{
              base: 'text-lg',
              sm: 'heading-sm-lg'
            }}
            as="h2"
          >
            {t`packageBanner.title`}
          </Heading>

          <Text size={{ base: 'sm', sm: 'md' }} mt="4">
            {t`packageBanner.subtitle1`}
          </Text>

          {/*<Text size={{ base: 'sm', sm: 'md' }} mt="4">*/}
          {/*  {t`packageBanner.subtitle2`}*/}
          {/*</Text>*/}

          <LinkOverlay>
            <Button
              size="lg"
              variant="solid-blue"
              mt="6"
              width="fit-content"
              href="https://www.mytour.am/packages?from=2025-10-16&to=2025-10-23&city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1398&returnFlightId=1398&tab=packages"
              target="_blank"
              rel="noopener noreferrer"
              zIndex="0 !important"
            >
              {t`packageBanner.buttonLabel`}
            </Button>
          </LinkOverlay>
        </Flex>
      </Flex>
    </LinkBox>
  )
}
