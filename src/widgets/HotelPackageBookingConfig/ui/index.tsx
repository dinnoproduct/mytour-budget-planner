import { type LayoutProps, type PackageBookingConfigProps } from './types.ts'
import {
  Box,
  type BoxProps,
  Flex,
  Grid,
  HStack,
  VStack
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { AlertCardMessage, Button, Icon, Text } from '@ui'
import { FlightsConfigButton } from '@widgets/PackageBookingConfig/ui/FlightsConfigButton.tsx'
import { SearchTravelers } from '@features/SearchTravelers'
import { TravelersConfigButton } from '@widgets/PackageBookingConfig/ui/TravelersConfigButton.tsx'
import { RoomsMenu } from '@features/RoomsMenu'
import { useBookingConfig, useFreeCancellation } from '../hooks'
import { numberWithCommaNormalizer } from '@/utils/normalizers.ts'
import { useBreakpoint } from '@shared/hooks'
import { useEffect, useMemo, useState } from 'react'
import { DatePicker } from '@features/DatePicker'
import { approximateNumber, formatNumber } from '@shared/utils'

export const HotelPackageBookingConfig = ({
  tourPackage,
  onLateCheckoutChange,
  containerRef,
  onBookClick,
  ...props
}: PackageBookingConfigProps) => {
  const { t } = useTranslation()
  const { isMd } = useBreakpoint()

  const {
    bookingData,
    selectedOffer,
    flightsDatePickerProps,
    searchTravelersProps,
    roomsMenuProps,
    isNotFound,
    isLoadingTourPackage
  } = useBookingConfig(tourPackage)
  const { showFreeCancellation, freeCancellationDate } = useFreeCancellation(
    bookingData.checkIn,
    bookingData.checkOut
  )

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

  const usdPrice = useMemo(
    () =>
      formatNumber(approximateNumber(tourPackage.price, tourPackage.usdRate)),
    [tourPackage.price, tourPackage.usdRate]
  )

  return (
    <Layout isFixed={isFixed} {...props}>
      <VStack
        align="stretch"
        py="4"
        spacing="4"
        gridArea="config"
        borderTop="1px solid"
        borderColor={{ base: 'gray.100', md: 'transparent' }}
      >
        <DatePicker
          CustomButton={FlightsConfigButton}
          menuProps={{ offset: [-4, -28] }}
          {...flightsDatePickerProps}
        />

        <SearchTravelers
          menuProps={{ offset: [12, -28] }}
          {...searchTravelersProps}
          CustomButton={TravelersConfigButton}
        />

        <RoomsMenu {...roomsMenuProps} priceType="room" />

        {isNotFound ? (
          <Box px="4">
            <AlertCardMessage
              status="error"
              message={t`noRoomsFoundWithParams`}
            />
          </Box>
        ) : null}
      </VStack>

      {showFreeCancellation ? (
        <SectionLayout
          gridArea="availability"
          borderColor={{ base: 'transparent', md: 'gray.100' }}
        >
          {/*<HStack px="4" spacing="2">*/}
          {/*	<Icon name="status-info" size="20"/>*/}
          {/*	<Text size="sm">*/}
          {/*		{t('availableSeats', { count: availableSeats as any })}*/}
          {/*	</Text>*/}
          {/*</HStack>*/}

          {showFreeCancellation ? (
            <HStack
              px="4"
              spacing="2"
              // mt="4"
            >
              <Icon name="status-success" size="20" />
              <Text size="sm">
                {t`freeCancellationUntil`} {freeCancellationDate}
              </Text>
            </HStack>
          ) : null}
        </SectionLayout>
      ) : null}

      <SectionLayout
        px="4"
        gridArea="totalPrice"
        position={{
          base: 'fixed',
          md: 'static'
        }}
        bottom="0"
        left="0"
        right="0"
        width="full"
      >
        <Flex width="full" justify="space-between" align="center" height="28px">
          <Text size="sm">{t`total`}</Text>

          <Text size="lg" fontWeight="bold" ml="2">
            {numberWithCommaNormalizer(selectedOffer?.price)} ֏
          </Text>
        </Flex>

        <Flex height="28px" mt="2" align="center" ml="auto" justify="end">
          <Icon name="approximate" size="20" color="gray.500" />

          <Text size="sm" color="gray.500" ml="0.5">
            $ {usdPrice}
          </Text>
        </Flex>

        <Button
          mt="2"
          width="full"
          isDisabled={isNotFound}
          isLoading={isLoadingTourPackage}
          onClick={handleBookClick}
          size="lg"
        >
          {t`book`}
        </Button>
      </SectionLayout>
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

const SectionLayout = (props: BoxProps) => (
  <Box
    py={{ base: '5', md: '4' }}
    borderTop="1px solid"
    borderColor="gray.100"
    bgColor="white"
    {...props}
  />
)
