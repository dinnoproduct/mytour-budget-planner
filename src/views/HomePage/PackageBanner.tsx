import {
  Box,
  Image,
  LinkBox,
  type LinkBoxProps
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import React, { useCallback } from "react";
import { useFlightDates } from "@entities/package/hooks/useFlightDates";
import { fmt } from "@/utils/methods";
import { useLanguageRouting } from '@/hooks/useLanguageRouting';
import { useExternalBanners } from '@entities/notification';
import { useLanguageNavigate } from '@/hooks/useLanguageNavigate';


export const PackageBanner: React.FC<LinkBoxProps> = ({ ...props }) => {
  const { t } = useTranslation()
  const date = new Date()
  const firstOfTarget = new Date(date.getFullYear(), date.getMonth() + 2, 1);
  const lastOfTarget = new Date(date.getFullYear(), date.getMonth() + 3, 0);
  const { data: data = { flightStartDate: '', flightReturnDate: '', returnFlightId: '', startFlightId: '' } } = useFlightDates()
  const { getPathWithLanguage } = useLanguageRouting()
  const { navigateTo } = useLanguageNavigate()
  const { data: banners } = useExternalBanners()
  const isHotel = true
  const dateFrom = fmt(!isHotel ? firstOfTarget : new Date(data?.flightStartDate));
  const dateTo = fmt(!isHotel ? lastOfTarget : new Date(data?.flightReturnDate));
  const defaultHref = !isHotel
    ? getPathWithLanguage(`/packages?from=${dateFrom}&to=${dateTo}&city=16%2C18%2C19&adultsCount=2&childrenCount=0&childrenAges=&days=7&dateMode=approximate&tab=hotel`)
    : getPathWithLanguage(`/packages?from=${dateFrom}&to=${dateTo}&city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=${data?.startFlightId}&returnFlightId=${data?.returnFlightId}&days=6&tab=packages`)
  const bannerType = !isHotel ? 'HOTEL' : 'PACKAGE'
  const selectedBanner = banners?.[bannerType]
    ?.slice()
    .sort((a, b) => a.displayOrder - b.displayOrder)[0]
  const desktopImage = selectedBanner?.imageUrl
    ?? `/assets/package-banner/${!isHotel ? '4' : ''}0.png`
  const mobileImage = selectedBanner?.mobileImageUrl ?? desktopImage

  const handleBannerClick = useCallback(() => {
    const ctaLink = selectedBanner?.cta?.link
    const ctaType = selectedBanner?.cta?.linkType

    if (ctaLink) {
      if (ctaType === 'INTERNAL') {
        try {
          navigateTo(ctaLink)
        } catch {
          window.location.href = ctaLink
        }
      } else {
        window.location.href = ctaLink
      }
      return
    }

    try {
      navigateTo(defaultHref)
    } catch {
      window.location.href = defaultHref
    }
  }, [selectedBanner, navigateTo, defaultHref])

  return (
    <LinkBox
      as="button"
      type="button"
      onClick={handleBannerClick}
      textDecoration='none'
      _hover={{ textDecoration: 'none' }}
      width="full"
      rounded="40px"
      overflow="hidden"
      display="block"
      p={0}
      {...props}
    >
      <Image
        src={mobileImage}
        alt={selectedBanner?.title ?? t('packageBanner.title.package')}
        display={{ base: 'block', md: 'none' }}
        w="full"
        h="auto"
        objectFit="contain"
      />
      <Image
        src={desktopImage}
        alt={selectedBanner?.title ?? t('packageBanner.title.package')}
        display={{ base: 'none', md: 'block' }}
        w="full"
        h="auto"
        objectFit="contain"
      />

    </LinkBox>
  )
}
