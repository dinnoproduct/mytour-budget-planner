import { Box, type LinkProps, Link, Flex } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { numberWithCommaNormalizer } from '@/utils/normalizers.ts'
import ImageSlider from './ImageSlider.tsx'
import { type ReactNode, useMemo } from 'react'
import { CURRENCY_MAP, LANGUAGE_PREFIX } from '@shared/model'
import { type Language } from '@widgets/Header/model'
import { Icon, Text } from '@ui'
import { Link as ReactLink } from 'react-router-dom'
import {
  type DictionaryTypes,
  type PackageCity,
  type PackageCountry,
  type PackageEntity,
  useDictionary
} from '@entities/package'
import { getPluralForm } from '@shared/helpers'
import { type PackageCardBasicProps } from './types.ts'
import { formatNumber } from '@shared/utils'
import { useSelectedPackage } from '@/modules/packages/hooks/useSelectedPackage.ts'
import { type EmptyObject } from 'global'

export const PackageCardBasic = ({
  tourPackage = {},
  link,
  ...props
}: PackageCardBasicProps) => {
  const { i18n, t } = useTranslation()

  const { data: foodTypes = [] } = useDictionary(
    'FoodTypeDictionary' as DictionaryTypes.FoodTypeDictionary
  )

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

  return (
    <Layout link={link} tourPackage={tourPackage} {...props}>
      <ImageSlider
        images={tourPackage.hotel.images}
        starsCount={tourPackage.hotel.stars}
        foodType={foodTypes[tourPackage?.foodType]?.value || undefined}
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
          </Flex>

          <Flex height="28px" mt="1" align="center">
            <Icon name="approximate" size="20" color="gray.600" />

            <Text size="sm" color="gray.600" ml="0.5">
              {CURRENCY_MAP[tourPackage.currency]}{' '}
              {formatNumber(parseFloat(tourPackage.priceInCurrency))}
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
  tourPackage,
  ...props
}: { 
  children: ReactNode | ReactNode[]; 
  link: string; 
  tourPackage: PackageEntity | EmptyObject;
} & LinkProps) => {
  const { storeSelectedPackage } = useSelectedPackage()

  const handleClick = () => {
    if (tourPackage && 'offerId' in tourPackage && tourPackage.offerId) {
      storeSelectedPackage(tourPackage as PackageEntity);
    }
  };

  return (
    <Link 
      as={ReactLink} 
      to={link} 
      onClick={handleClick}
      _hover={{ textTransform: 'none' }} 
      {...props}
    >
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
}
