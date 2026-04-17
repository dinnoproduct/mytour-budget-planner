import { type PackageDetailsProps } from './types.ts'
import { Flex, ListItem } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { HotelPackageDescription } from './HotelPackageDescription.tsx'
import { CardSectionLayout } from '@/shared/ui/layout/CardSectionLayout.tsx'
import { type DictionaryTypes, PACKAGE_FACILITY_ICON_MAP, useDictionary } from '@entities/package'
import { SummaryCard } from '@widgets/PackageDetails/ui/SummaryCard.tsx'
import { UnorderedList } from '@chakra-ui/react'
import { useMemo } from 'react'
import { GuestReviews } from './GuestReviews.tsx'

export const HotelPackageDetails = ({ tourPackage }: PackageDetailsProps) => {
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
      <CardSectionLayout title={t`hotelDetails`}>
        <HotelPackageDescription tourPackage={tourPackage} />
      </CardSectionLayout>
      <CardSectionLayout title={t`hotelDetails`}>
        <UnorderedList listStyleType="none" spacing="4" mx="0" mt="4">
          {hotelFacilities?.map(({ key, value }) => (
            <ListItem key={key}>
              <SummaryCard
                iconName={PACKAGE_FACILITY_ICON_MAP[key]}
                children={value}
              />
            </ListItem>
          ))}
        </UnorderedList>
      </CardSectionLayout>
      <CardSectionLayout title={t`reviewsAccordingToBooking`}>
        <GuestReviews
          travellersRating={tourPackage.hotel?.travellersRating}
          cleanliness={tourPackage.hotel?.cleanliness}
        />
      </CardSectionLayout>
      <CardSectionLayout>
        <iframe
          width="100%"
          height={"350"}
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${mapQuery}`}
        />
      </CardSectionLayout>
    </Flex>
  )
}

export { HotelPackageDetailsHeader } from './HotelPackageDetailsHeader.tsx'
