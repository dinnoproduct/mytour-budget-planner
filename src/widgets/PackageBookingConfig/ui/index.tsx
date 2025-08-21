import { type LayoutProps, type PackageBookingConfigProps } from './types.ts'
import { Box, Flex, Grid } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Button, Icon, Text } from '@ui'
import { useBookingConfig } from '@widgets/PackageBookingConfig/hooks'
import { numberWithCommaNormalizer } from '@/utils/normalizers.ts'
import { useBreakpoint } from '@shared/hooks'
import { useEffect, useState } from 'react'
import { formatNumber } from '@shared/utils'
import { CURRENCY_MAP } from '@/shared/model/index.ts'
import { CardSectionLayout } from '@/shared/ui/layout/CardSectionLayout.tsx'

export const PackageBookingConfig = ({
  tourPackage,
  containerRef,
  onBookClick,
  ...props
}: PackageBookingConfigProps) => {
  const { t } = useTranslation()
  const { isMd } = useBreakpoint()

  const {
    bookingData,
    selectedOffer,
    isNotFound,
    isLoadingTourPackage,
    currentOfferPackage
  } = useBookingConfig(tourPackage)

  const [isFixed, setIsFixed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef?.current && isMd) {
        const layoutTop = containerRef.current.getBoundingClientRect().top

        if (layoutTop <= 40 && !isFixed) {
          setIsFixed(true)
        } else if (layoutTop > 40 && isFixed) {
          setIsFixed(false)
        }
      }
    }

    if (!isMd) {
      setIsFixed(false)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isFixed, isMd, containerRef?.current])

  const handleBookClick = () => {
    onBookClick &&
      onBookClick({
        childrenAges: bookingData.travelersData.childrenAges
      })
  }

  return (
    <Layout isFixed={isFixed} {...props}>
      <CardSectionLayout 
        px="4"
        gridArea="totalPrice"
        position={{
          base: 'fixed',
          md: 'static'
        }}
        bottom="0"
        left="0"
        right="0"
        width="full">
        <Flex width="full" justify="space-between" align="center" height="28px">
          <Text size="sm">{t`total`}</Text>

          <Flex>
            <Text size="lg" fontWeight="bold" ml="2">
              {numberWithCommaNormalizer(selectedOffer?.price)} ֏
            </Text>
            <Flex align="center" ml="2">
              {currentOfferPackage ? (
                <>
                  <Icon name="approximate" size="20" color="gray.500" />

                  <Text size="sm" color="gray.500" ml="0.5">
                    {CURRENCY_MAP[currentOfferPackage.currency]}{' '}
                    {formatNumber(parseFloat(currentOfferPackage.priceInCurrency))}
                  </Text>
                </>
              ) : null}
            </Flex>
          </Flex>
        </Flex>

        <Button
          mt="4"
          width="full"
          isDisabled={isNotFound}
          isLoading={isLoadingTourPackage}
          onClick={handleBookClick}
          size="lg"
        >
          {t`book`}
        </Button>
      </CardSectionLayout>
    </Layout>
  )
}

export const Layout = ({ children, isFixed, ...props }: LayoutProps) => (
  <Box width={{ base: 'full', md: '442px' }} {...props}>
    <Grid
      width={{ base: 'full', md: '442px' }}
      borderY="1px solid"
      borderX={{
        base: 'none',
        md: '1px solid'
      }}
      bgColor="white"
      borderTopColor="gray.100"
      borderLeftColor={{ base: 'transparent', md: 'gray.100' }}
      borderRightColor={{ base: 'transparent', md: 'gray.100' }}
      borderBottomColor="gray.100"
      rounded={{ base: 'none', md: 'md' }}
      height="fit-content"
      templateAreas={{
        base: `
        "availability"
        "config"
        "lateCheckout"
        "totalPrice"
        `,
        md: `
        "config"
        "availability"
        "lateCheckout"
        "totalPrice"
        `
      }}
      gridTemplateRows="auto"
      gridTemplateColumns="1fr"
      position={isFixed ? 'fixed' : 'static'}
      top={isFixed ? '40px' : 'auto'}
    >
      {children}
    </Grid>
  </Box>
)
