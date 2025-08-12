import {Box, Flex, LinkBox, type LinkBoxProps, LinkOverlay} from '@chakra-ui/react'
import { Button, Heading, Text } from '@ui'
import { useTranslation } from 'react-i18next'

export const PackageBanner = (props: LinkBoxProps) => {
  const { t } = useTranslation()
    const date = new Date()

    const firstOfTarget = new Date(date.getFullYear(), date.getMonth() + 2, 1);
    const lastOfTarget  = new Date(date.getFullYear(), date.getMonth() + 3, 0);

    const fmt = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    const dateFrom = fmt(firstOfTarget);
    const dateTo   = fmt(lastOfTarget);

  return (
    <LinkBox
      height={{
        base: '440px', // height at base size
        // xs: '230px',
        sm: '296px',
        lg: '330px'
      }}
      rounded="40px"
      mx={{ base: 4, md: 6 }}
      bgImage={`linear-gradient(90deg, rgba(38,231,139,.8), rgba(80,148,255,.8))`}
      bgBlendMode="overlay"
      bgRepeat="no-repeat"
      bgSize={{ base: 'cover' }}
      bgPosition={{ base: '50%' }}
      {...props}
    >
        <Box
            height={{
                base: '850px',
            }}
            width='610px'
            top={{ base: '-80px', md: '-225px' }}
            right={0}
            zIndex={1}
            position='absolute'
            bgImage={` url('/assets/package-banner/40.png')`}
            bgBlendMode="overlay"
            bgRepeat="no-repeat"
            bgSize='cover'
            bgPosition={{ base: '40%', md: '' }}>
        </Box>
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
            color='white'
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

          <Text color='white' size={{ base: 'sm', sm: 'md' }} mt="4">
            {t`packageBanner.subtitle1`}
          </Text>

          {/*<Text size={{ base: 'sm', sm: 'md' }} mt="4">*/}
          {/*  {t`packageBanner.subtitle2`}*/}
          {/*</Text>*/}

          <LinkOverlay>
            <Button
                background='white'
                borderRadius='100px'
                color='green.500'
              size="lg"
              variant="solid-blue"
              mt="6"
              width="fit-content"
              href={`https://www.mytour.am/packages?from=${dateFrom}&to=${dateTo}&city=16%2C18%2C19&adultsCount=2&childrenCount=0&childrenAges=&days=7&dateMode=approximate&tab=hotel`}
              target="_blank"
              rel="noopener noreferrer"
              zIndex="0 !important"
                _hover={{
                    color: 'white',
                    background: 'blue.500'
                }}
            >
              {t`packageBanner.buttonLabel`}
            </Button>
          </LinkOverlay>
        </Flex>
      </Flex>
    </LinkBox>
  )
}
