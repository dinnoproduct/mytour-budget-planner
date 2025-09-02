import {
  Box,
  Flex,
  Link,
  LinkBox,
  type LinkBoxProps,
  LinkOverlay
} from '@chakra-ui/react'
import {Button, Heading, Text} from '@ui'
import {useTranslation} from 'react-i18next'
import React from "react";
import {useFlightDates} from "@entities/package/hooks/useFlightDates.ts";

interface PackageBannerProps extends LinkBoxProps {
    isHotel: number;
}

export const PackageBanner: React.FC<PackageBannerProps> = ({ isHotel, ...props }) => {
    const {t} = useTranslation()
    const date = new Date()
    const firstOfTarget = new Date(date.getFullYear(), date.getMonth() + 3, 1);
    const lastOfTarget = new Date(date.getFullYear(), date.getMonth() + 4, 0);
    const { data: dates = {flightStartDate: '', flightReturnDate: ''}} = useFlightDates()

  const fmt = (d: Date | string | undefined | null) => {
    if (!d) return "";

    if (typeof d === "string") {
      return d.slice(0, 10); // "2025-10-17"
    }

    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  };

    const dateFrom = fmt(!isHotel ? firstOfTarget : new Date(dates?.flightStartDate));
    const dateTo = fmt(!isHotel ? lastOfTarget : new Date(dates?.flightReturnDate));
    return (
        <LinkBox
            height={{
                base: '440px',
                sm: !isHotel ? '330px' : '270px'
            }}
            rounded="40px"
            bgImage={!isHotel ?`linear-gradient(90deg, rgba(38,231,139,.8), rgba(80,148,255,.8))` :'linear-gradient(90deg, #FF9A3D 0%, #FF4E00 100%)'}
            bgBlendMode="overlay"
            bgRepeat="no-repeat"
            bgSize={{base: 'cover'}}
            bgPosition={{base: '50%'}}
            {...props}
        >
          <Link
            href={!isHotel ? `https://www.mytour.am/packages?from=${dateFrom}&to=${dateTo}&city=16%2C18%2C19&adultsCount=2&childrenCount=0&childrenAges=&days=7&dateMode=approximate&tab=hotel` :
              `https://www.mytour.am/packages?from=${dates?.flightStartDate}&to=${dates?.flightReturnDate}&city=1&adultsCount=2&childrenCount=0&childrenAges=&days=6&dateMode=approximate&tab=packages`}
            target="_blank"
            textDecoration='none'
            _hover={{ textDecoration: 'none' }}
            zIndex="0 !important">
            <Box
              height={{
                base: '200px',
                sm: '400px'
              }}
              width={{
                base: '330px',
                sm: !isHotel ? '610px' : '640px'
              }}
              top={{base: 'initial', sm: !isHotel ? '-8px' : '-130px'}}
              bottom={{base: '0', sm: !isHotel ? '-8px' : '-130px'}}
              right={!isHotel ? 0 : 5}
              zIndex={-2}
              position='absolute'
              bgImage={` url('/assets/package-banner/${!isHotel ? '4' : ''}0.png')`}
              bgBlendMode="overlay"
              bgRepeat="no-repeat"
              bgSize='cover'
              bgPosition={{base: '40%', md: ''}}>
            </Box>
            <Flex
              height="full"
              align={{base: 'start', sm: 'center'}}
              px={{base: 5, sm: 10}}
              pt={{base: 5, sm: 0}}
            >
              <Flex
                direction="column"
                maxWidth={{
                  base: 'full',
                  // xs: '52%',
                  sm: '70%',
                  lg: '900px'
                }}
                width="full"
                zIndex={-2}
              >
                <Heading
                  color='white'
                  fontSize={{
                    base: 'text-3xl',
                    sm: 'text-5xl'
                  }}
                  lineHeight={{
                    base: 'text-3xl',
                    sm: 'text-5xl'
                  }}
                  as="h2"
                >
                  {isHotel ? t`packageBanner.title.package` : t`packageBanner.title.hotel`}
                </Heading>

                <Text color='white' size={{base: 'md', sm: '2xl'}} mt="11px">
                  {isHotel ? t`packageBanner.subtitle1.package` : t`packageBanner.subtitle1.hotel`}
                </Text>

                <LinkOverlay>
                  <Box
                    background='white'
                    borderRadius='100px'
                    color={!isHotel ? 'green.500' : 'orange.500'}
                    fontSize="lg"
                    p='12px 24px'
                    mt="4"
                    width="fit-content"
                    zIndex="0 !important"
                  >
                    {isHotel ? t`packageBanner.buttonLabel.package` : t`packageBanner.buttonLabel.hotel`}
                  </Box>
                </LinkOverlay>
              </Flex>
            </Flex>

          </Link>
        </LinkBox>
    )
}
