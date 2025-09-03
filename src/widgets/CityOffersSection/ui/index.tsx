import {
  Box,
  type BoxProps,
  Heading,
  Text,
  SimpleGrid,
  IconButton,
  Flex,
  type LinkBoxProps,
  Link, Image,
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import React, { type ReactNode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useFlightDates } from '@entities/package/hooks/useFlightDates.ts'
import {
  useCities,
  useHotelPackagesSearchContext,
} from '@entities/package'
import {
  countryCards,
  packageCards as baseCityCards,
} from '@/constants/constants.ts'
import { LANGUAGE_PREFIX, type LanguageName } from '@shared/model'
import {fmt} from "@/utils/methods.ts";

export interface PackageCountry {
  id: number
  nameArm: string
  nameEng: string
  nameRus: string
}

type NameKey = 'nameArm' | 'nameEng' | 'nameRus'

interface CityOffersSectionProps extends LinkBoxProps {
  isHotel: number
}

export const CityOffersSection: React.FC<CityOffersSectionProps> = ({
                                                                      isHotel,
                                                                      ...props
                                                                    }) => {
  const { data: dates = { flightStartDate: '', flightReturnDate: '' } } =
    useFlightDates()
  const { i18n, t } = useTranslation()
  const { cities } = useHotelPackagesSearchContext()
  const { data: packageCities = [] } = useCities()
  const { data: data = {flightStartDate: '', flightReturnDate: '', returnFlightId: '', startFlightId: ''}} = useFlightDates()

  const nameKey = useMemo(
    () =>
      (`name${
        LANGUAGE_PREFIX[i18n.language as LanguageName]
      }` as NameKey),
    [i18n.language]
  )

  const cards = useMemo(() => {
    const pickName = <T extends { nameArm: string; nameEng: string; nameRus: string }>(
      obj?: T
    ) => (obj ? (obj as any)[nameKey] ?? obj.nameEng : '')

    if (isHotel) {
      const countryMap = new Map<number, PackageCountry>()
      ; cities.forEach((c: any) => {
        const cnt = c?.country
        if (cnt) {
          countryMap.set(cnt.id, {
            id: cnt.id,
            nameArm: cnt.nameArm,
            nameEng: cnt.nameEng,
            nameRus: cnt.nameRus,
          })
        }
      })

      return countryCards.map((card) => {
        const country = countryMap.get(card.countryId)
        const countryName = pickName(country)
        return {
          id: card.countryId,
          image: card.image,
          titleLeft: countryName,
          titleRight: '',
          cityParam: card.cities,
        }
      })
    }

    return baseCityCards.map((card) => {
      const city =
        packageCities.find((c: any) => c.id === card.id) ||
        cities.find((c: any) => c.id === card.id)

      const countryName = pickName(city?.country)
      const cityName = pickName(city as any)

      const cityId = city?.id ?? card.id

      return {
        id: cityId,
        image: card.image,
        titleLeft: countryName,
        titleRight: cityName,
        cityParam: String(cityId),
      }
    })
  }, [isHotel, cities, packageCities, nameKey])

  const date = new Date()
  const firstOfTarget = new Date(date.getFullYear(), date.getMonth() + 2, 1);
  const lastOfTarget = new Date(date.getFullYear(), date.getMonth() + 3, 0);
  const dateFrom = (isHotel ? fmt(firstOfTarget) : data.flightStartDate)?.slice(0, 10);
  const dateTo = (isHotel ? fmt(lastOfTarget) : data?.flightReturnDate)?.slice(0, 10);
  const hasDates = Boolean(dateFrom && dateTo)


  return (
    <Layout {...props}>
      <Heading
        as="h3"
        fontSize={{ base: '2xl', md: '4xl' }}
        mb={{ base: 6, md: 10 }}
      >
        {!isHotel ? t`packageOffers` : t`hotelOffers`}
      </Heading>

      <SimpleGrid columns={{ base: 1, md: !isHotel ? 2 : 3 }} spacing={6}>
        {!hasDates
          ? Array.from({ length: !isHotel ? 2 : 3 }).map((_, i) => (
            <SkeletonCard key={`skeleton-${i}`} />
          ))
          : cards.map((card) => (
            card.id === 2 ?
              <Box
                display='flex'
                flexDirection='column'
                borderRadius='12px'
                minH={{ base: '196px', sm: '362px' }}
                bgColor='gray.100'
                textAlign='center'
              >
                <Box m='auto'>
                  <Image src="/images/no_direction.svg" alt="" mx='auto'/>
                  <Text color="gray.800" fontWeight="700" fontSize='16px' mt='6px'>
                    {t`noDirection`}
                  </Text>
                </Box>
              </Box> :
            <Link
              key={`${!isHotel ? 'city' : 'country'}-${card.id}`}
              position="relative"
              borderRadius='12px'
              overflow="hidden"
              role="group"
              minH={{ base: '196px', sm: '362px' }}
              href={`https://www.mytour.am/packages?from=${dateFrom}&to=${dateTo}&city=${card.cityParam}&adultsCount=2&childrenCount=0&childrenAges=
              ${isHotel ? '' : `&departureFlightId=${data?.startFlightId}&returnFlightId=${data?.returnFlightId}`}
              &days=${isHotel ? '7' : '6'}${isHotel ? '&dateMode=approximate' : ''}&tab=${isHotel ? 'hotel' : 'packages'}`}
              _before={{
                content: '""',
                position: 'absolute',
                inset: 0,
                bgImage: `url('${card.image}')`,
                bgSize: 'cover',
                bgPos: 'center',
                filter: 'auto',
                brightness: '0.9',
                transition: 'transform .4s ease',
                transform: 'scale(1)',
              }}
              _after={{
                content: '""',
                position: 'absolute',
                inset: 0,
                bgGradient:
                  'linear(to-b, blackAlpha.300 0%, blackAlpha.400 40%, blackAlpha.700 100%)',
              }}
              _hover={{
                _before: { transform: 'scale(1.03)' },
              }}
            >
              <Flex
                position="relative"
                zIndex={1}
                direction="column"
                justify="flex-end"
                h="full"
                p={{ base: 4, md: 6 }}
                gap={2}
              >
                <Box>
                  <Heading
                    as="h4"
                    fontSize={{ base: 'xl', md: '2xl' }}
                    color="white"
                  >
                    {card.titleLeft}
                    {card.titleRight ? ` | ${card.titleRight}` : ''}
                  </Heading>

                  <IconButton
                    height={{ base: "24px", sm: "40px" }}
                    width={{ base: "24px", sm: "40px" }}
                    minWidth='initial'
                    aria-label="View offer"
                    icon={<ChevronRightIcon boxSize={{ base: "16px", md: "24px" }} />}
                    color="white"
                    position="absolute"
                    right={{ base: 4, md: 6 }}
                    transform="translateY(-50%)"
                    rounded="full"
                    bg="whiteAlpha.400"
                    _hover={{pointerEvents: 'none'}}
                    _focus={{pointerEvents: 'none'}}
                  />
                </Box>
                <Text color="whiteAlpha.900" fontSize={{ base: 'sm', md: 'md' }}>
                  {t`included`} • {!isHotel ? (<>{t`flight`} + {t`hotel`}</>) : t`hotel`}
                </Text>
              </Flex>

            </Link>
          ))}
      </SimpleGrid>
    </Layout>
  )
}

const SkeletonCard = () => (
  <Box
    rounded="lg"
    minH={{ base: '180px', md: '220px' }}
    bg="gray.200"
    _dark={{ bg: 'gray.700' }}
    animation="pulse 2s infinite"
  />
)

const Layout = ({
                  children,
                  ...props
                }: { children: ReactNode | ReactNode[] } & BoxProps) => (
  <Box px={{ base: 4, md: 6 }} {...props}>
    <Box maxWidth="1376px" mx="auto">
      <Box>{children}</Box>
    </Box>
  </Box>
)
