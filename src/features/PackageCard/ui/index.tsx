import { Box, type LinkProps, Link, Flex } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { numberWithCommaNormalizer } from '@/utils/normalizers.ts'
import ImageSlider from './ImageSlider.tsx'
import { type ReactNode, useMemo } from 'react'
import { LANGUAGE_PREFIX } from '@shared/model'
import { type Language } from '@widgets/Header/model'
import { Icon, Text } from '@ui'
import { Link as ReactLink } from 'react-router-dom'
import {
  type PackageCity,
  type PackageCountry,
  type PackageEntity
} from '@entities/package'
import { getPluralForm } from '@shared/helpers'
import { type PackageCardProps } from './types.ts'
import { approximateNumber, formatNumber } from '@shared/utils'

export const PackageCard = ({
  tourPackage = {},
  link,
  ...props
}: PackageCardProps) => {
  const { i18n, t } = useTranslation()

  const languageSuffix = useMemo(
    () => LANGUAGE_PREFIX[i18n.language as Language['name']],
    [i18n.language]
  )

  const cityLabel = useMemo(
    () =>
      tourPackage.city[
        ('name' + languageSuffix) as keyof PackageCity
      ] as string,
    [tourPackage.city, languageSuffix]
  )

  const countryLabel = useMemo(
    () =>
      tourPackage.city.country[
        ('name' + languageSuffix) as keyof PackageCountry
      ] as string,
    [tourPackage.city.country, languageSuffix]
  )

  const packageName = useMemo(
    () =>
      tourPackage[('name' + languageSuffix) as keyof PackageEntity] as string,
    [tourPackage, languageSuffix]
  )

  const childrenTravelers = useMemo(() => {
    const childrenCount =
      tourPackage?.childrenTravelers + tourPackage?.infantTravelers

    if (childrenCount === 0) return ''

    return `, ${childrenCount} ${t(getPluralForm(childrenCount, 'children'))}`
  }, [
    tourPackage?.childrenTravelers,
    tourPackage?.infantTravelers,
    languageSuffix
  ])

  const usdPrice = useMemo(
    () =>
      formatNumber(approximateNumber(tourPackage.price, tourPackage.usdRate)),
    [tourPackage.price, tourPackage.usdRate]
  )

  const isHotelPackage = useMemo(
    () => !tourPackage.destinationFlight?.departureDate,
    [tourPackage.destinationFlight?.departureDate]
  )

  return (
    <Layout link={link} {...props}>
      <ImageSlider
        images={tourPackage.hotel.images}
        starsCount={tourPackage.hotel.stars}
        allInclusive={!isHotelPackage && !!tourPackage.foodType}
      />

      <Box py="4">
        <Box px="4">
          <Text
            color="gray.800"
            size="sm"
            fontWeight="semibold"
            noOfLines={1}
            as="h3"
          >
            {packageName}
          </Text>

          <Text size="sm" color="gray.600" mt="1">
            {cityLabel}, {countryLabel}
          </Text>
        </Box>

        <Box mt="4" px="4">
          <Flex align="center">
            <Text size="lg" fontWeight="bold" color="gray.800">
              {numberWithCommaNormalizer(tourPackage.price)} ֏
            </Text>

            {/*{tourPackage.hotOffer ?*/}
            {/*	<Text size="sm" fontWeight="normal" color="red.500" textDecoration="line-through" ml="2">*/}
            {/*		{numberWithCommaNormalizer(tourPackage.oldPrice)} ֏*/}
            {/*	</Text>*/}
            {/*	: null}*/}
          </Flex>

          <Flex height="28px" mt="1" align="center">
            <Icon name="approximate" size="20" color="gray.600" />

            <Text size="sm" color="gray.600" ml="0.5">
              $ {usdPrice}
            </Text>
          </Flex>

          <Text mt="1" size="sm" color="gray.600">
            {tourPackage.adultTravelers}{' '}
            {t(getPluralForm(tourPackage.adultTravelers, 'adults'))}
            {childrenTravelers} • {tourPackage.nights}{' '}
            {t(getPluralForm(tourPackage.nights, 'nights'))}
          </Text>
        </Box>
      </Box>
    </Layout>
  )
}

const Layout = ({
  children,
  link,
  ...props
}: { children: ReactNode | ReactNode[]; link: string } & LinkProps) => (
  <Link as={ReactLink} to={link} _hover={{ textTransform: 'none' }} {...props}>
    <Box
      maxWidth="362px"
      width="full"
      rounded="lg"
      overflow="hidden"
      border="1px solid"
      borderColor="gray.200"
    >
      {children}
    </Box>
  </Link>
)
