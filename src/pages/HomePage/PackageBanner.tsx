import {
  Box,
  Flex,
  LinkBox,
  type LinkBoxProps
} from '@chakra-ui/react'
import {Button, Heading, Text} from '@ui'
import {useTranslation} from 'react-i18next'
import React from "react";
import {useFlightDates} from "@entities/package/hooks/useFlightDates.ts";
import {fmt} from "@/utils/methods.ts";
import { useLanguageRouting } from '@/hooks/useLanguageRouting';

interface PackageBannerProps extends LinkBoxProps {
    isHotel: number;
}

export const PackageBanner: React.FC<PackageBannerProps> = ({ isHotel, ...props }) => {
    const {t} = useTranslation()
    const date = new Date()
    const firstOfTarget = new Date(date.getFullYear(), date.getMonth() + 2, 1);
    const lastOfTarget = new Date(date.getFullYear(), date.getMonth() + 3, 0);
    const { data: data = {flightStartDate: '', flightReturnDate: '', returnFlightId: '', startFlightId: ''}} = useFlightDates()
    const { getPathWithLanguage } = useLanguageRouting()

    const dateFrom = fmt(!isHotel ? firstOfTarget : new Date(data?.flightStartDate));
    const dateTo = fmt(!isHotel ? lastOfTarget : new Date(data?.flightReturnDate));
    return (
        <LinkBox
            as="a"
            href={!isHotel
              ? getPathWithLanguage(`/packages?from=${dateFrom}&to=${dateTo}&city=16%2C18%2C19&adultsCount=2&childrenCount=0&childrenAges=&days=7&dateMode=approximate&tab=hotel`)
              : getPathWithLanguage(`/packages?from=${dateFrom}&to=${dateTo}&city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=${data?.startFlightId}&returnFlightId=${data?.returnFlightId}&days=6&tab=packages`)
            }
            textDecoration='none'
            _hover={{ textDecoration: 'none' }}
            height={{
                base: '440px',
                sm: !isHotel ? '330px' : '270px'
            }}
            width="auto"
            rounded="40px"
            bgImage={!isHotel ?`linear-gradient(90deg, rgba(38,231,139,.8), rgba(80,148,255,.8))` :'linear-gradient(90deg, #FF9A3D 0%, #FF4E00 100%)'}
            bgBlendMode="overlay"
            bgRepeat="no-repeat"
            bgSize={{base: 'cover'}}
            bgPosition={{base: '50%'}}
            position="relative"
            display="block"
            {...props}
        >
            <Box
              height="full"
              display='flex'
              alignItems={{base: 'start', sm: "center"}}
            >
              <Flex
                align='start'
                direction="column"
                px={{base: 5, sm: 10}}
                pt={{base: 5, sm: 0}}
                maxWidth={{
                  base: 'full',
                  sm: '70%',
                  lg: '900px'
                }}
                width="full"
              >
                <Heading
                  color='white'
                  fontSize={{
                    base: '30px',
                    sm: '48px'
                  }}
                  lineHeight={{
                    base: '36px',
                    sm: '48px'
                  }}
                  as="h2"
                >
                  {isHotel ? t`packageBanner.title.package` : t`packageBanner.title.hotel`}
                </Heading>

                <Text color='white'
                      fontSize={{
                        base: '16px',
                        sm: '24px'
                      }}
                      lineHeight={{
                        base: '24px',
                        sm: '32px'
                      }} mt="11px">
                  {isHotel ? t`packageBanner.subtitle1.package` : t`packageBanner.subtitle1.hotel`}
                </Text>

                <Box
                  background='white'
                  borderRadius='100px'
                  color={!isHotel ? 'green.500' : 'orange.500'}
                  p='12px 24px'
                  mt="4"
                  width="fit-content"
                  zIndex="0 !important"
                  fontSize={{
                    base: '14px',
                    sm: '16px'
                  }}
                  lineHeight={{
                    base: '20px',
                    sm: '24px'
                  }}
                >
                  {isHotel ? t`packageBanner.buttonLabel.package` : t`packageBanner.buttonLabel.hotel`}
                </Box>
              </Flex>
            </Box>
            <Box
              height={{
                base: '200px',
                sm: '400px'
              }}
              width={{
                base: '330px',
                sm: !isHotel ? '610px' : '640px'
              }}
              bottom={0}
              top={{base: '240px', sm: !isHotel ? '-8px' : '-130px'}}
              right={!isHotel ? 0 : '30px'}
              zIndex={0}
              position='absolute'
              bgImage={`url('/assets/package-banner/${!isHotel ? '4' : ''}0.png')`}
              bgBlendMode="overlay"
              bgRepeat="no-repeat"
              bgSize='cover'
              bgPosition={{ base: '40%', md: 'center' }}>
            </Box>

        </LinkBox>
    )
}
