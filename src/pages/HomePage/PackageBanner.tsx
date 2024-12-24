import { Flex, LinkBox, type LinkBoxProps, LinkOverlay } from '@chakra-ui/react'
import { Button, Heading, Text } from '@ui'
import { useTranslation } from 'react-i18next'

export const PackageBanner = (props: LinkBoxProps) => {
  const { t } = useTranslation()

  return (
    <LinkBox
      height={{
        base: '440px', // height at base size
        xs: '230px',
        smd: '296px',
        lg: '330px'
      }}
      rounded="2xl"
      bgColor="gray.50"
      mx={{ base: 4, md: 6 }}
      bgImage={{
        base: 'url(/assets/package-banner/package-banner-sm.jpg)',
        xs: 'url(/assets/package-banner/package-banner-lg.jpg)'
      }}
      bgSize="cover"
      bgPosition={{
        base: 'bottom',
        xs: 'right center'
      }}
      bgRepeat="no-repeat"
      {...props}
    >
      <Flex
        height="full"
        align={{ base: 'start', smd: 'center' }}
        px={{ base: 5, smd: 10 }}
        pt={{ base: 5, smd: 0 }}
      >
        <Flex
          direction="column"
          maxWidth={{
            base: 'full',
            xs: '52%',
            smd: '53%',
            lg: '701px'
          }}
          width="full"
        >
          <Heading
            fontSize={{
              base: 'text-lg',
              smd: 'heading-sm-lg'
            }}
            lineHeight={{
              base: 'text-lg',
              smd: 'heading-sm-lg'
            }}
            as="h2"
          >
            {t`packageBanner.title`}
          </Heading>

          <Text size={{ base: 'sm', smd: 'md' }} mt="4">
            {t`packageBanner.subtitle1`}
          </Text>

          <Text size={{ base: 'sm', smd: 'md' }} mt="4">
            {t`packageBanner.subtitle2`}
          </Text>

          <LinkOverlay>
            <Button
              size="lg"
              variant="solid-blue"
              mt="6"
              width="fit-content"
              href="https://www.mytourpackages.am/tbilisi-newyear"
            >
              {t`packageBanner.buttonLabel`}
            </Button>
          </LinkOverlay>
        </Flex>
      </Flex>
    </LinkBox>
  )
}
