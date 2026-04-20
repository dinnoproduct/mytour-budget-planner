import { type PackageDetailsProps } from './types.ts'
import { Flex, UnorderedList } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { HotelPackageDescription } from './HotelPackageDescription.tsx'
import { CardSectionLayout } from '@/shared/ui/layout/CardSectionLayout.tsx'
import { type DictionaryTypes, PACKAGE_FACILITY_ICON_MAP, useDictionary } from '@entities/package'
import { SummaryCard } from '@widgets/PackageDetails/ui/SummaryCard.tsx'
import { useMemo } from 'react'
import { GuestReviews } from './GuestReviews.tsx'
import {
  HotelDetailsSectionNav,
  HOTEL_DETAILS_SECTION_IDS,
} from './HotelDetailsSectionNav.tsx'

const sectionScrollMargin = { base: '96px', md: '120px' } as const

export const HotelPackageDetails = ({
  tourPackage,
  containerRef,
  detailsColumnRef,
}: PackageDetailsProps) => {
  const { t } = useTranslation()
  const mapQuery = encodeURIComponent(`${tourPackage.hotel?.name}, ${tourPackage.city.nameEng}, ${tourPackage.city.country.nameEng}`)

  const { data: facilities = [] } = useDictionary(
    'FacilityDictionary' as DictionaryTypes.FacilityDictionary
  )
  const hotelFacilities = useMemo(() => {
    if (!facilities.length || !tourPackage.hotel?.facilities) {
      return []
    }

    return facilities.filter(({ key }) => tourPackage.hotel?.facilities & key)
  }, [facilities, tourPackage.hotel?.facilities])




  return (
    <Flex direction="column" mt={{ base: 2, md: 0 }} gap={{ base: "2", md: "6" }}>

      <CardSectionLayout
        id={HOTEL_DETAILS_SECTION_IDS.overview}
        scrollMarginTop={sectionScrollMargin}
        beforeTitle={
          <HotelDetailsSectionNav
            containerRef={containerRef}
            detailsColumnRef={detailsColumnRef}
          />
        }
        title={t`hotelDetails`}
      >
        <HotelPackageDescription tourPackage={tourPackage} />
      </CardSectionLayout>
      <CardSectionLayout
        id={HOTEL_DETAILS_SECTION_IDS.amenities}
        scrollMarginTop={sectionScrollMargin}
        title={t`hotelDetailsNavAmenities`}
      >
        <Flex listStyleType="none" gap="4" mx="0" flexWrap={'wrap'}>
          {hotelFacilities?.map(({ key, value }) => (
            <SummaryCard
              key={key}
              iconName={PACKAGE_FACILITY_ICON_MAP[key]}
              children={value}
            />
          ))}
        </Flex>
      </CardSectionLayout>
      <CardSectionLayout
        id={HOTEL_DETAILS_SECTION_IDS.ratings}
        scrollMarginTop={sectionScrollMargin}
        title={t`grades`}
      >
        <GuestReviews
          travellersRating={tourPackage.hotel?.travellersRating}
          cleanliness={tourPackage.hotel?.cleanliness}
        />
      </CardSectionLayout>
      <CardSectionLayout
        id={HOTEL_DETAILS_SECTION_IDS.map}
        scrollMarginTop={sectionScrollMargin}
      >
        <iframe
          width="100%"
          height={"350"}
          style={{ border: 0, borderRadius: '12px', overflow: 'hidden' }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${mapQuery}`}
        />
      </CardSectionLayout>
    </Flex>
  )
}

export { HotelPackageDetailsHeader } from './HotelPackageDetailsHeader.tsx'
