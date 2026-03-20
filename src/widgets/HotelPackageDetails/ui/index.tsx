import { type PackageDetailsProps } from './types.ts'
import { Flex } from '@chakra-ui/react'
import { SectionLayout } from './SectionLayout.tsx'
import { formatDate } from '../utils'
import { useTranslation } from 'react-i18next'
import { HotelPackageDescription } from './HotelPackageDescription.tsx'
import { CardSectionLayout } from '@/shared/ui/layout/CardSectionLayout.tsx'

export const HotelPackageDetails = ({ tourPackage }: PackageDetailsProps) => {
  const { t } = useTranslation()
  const mapQuery = encodeURIComponent(`${tourPackage.hotel?.name}, ${tourPackage.city.nameEng}, ${tourPackage.city.country.nameEng}`)

  return (
    <Flex direction="column" mt={{ base: 5, md: 0 }} gap="6">
      <CardSectionLayout>
        <SectionLayout
          title={t`hotelDetails`}
          listItems={[
            { key: t`checkIn`, value: formatDate(tourPackage.checkin) },
            { key: t`checkOut`, value: formatDate(tourPackage.checkout) }
          ]}
        />
        <SectionLayout
          mt="8"
          subtitle={t`reviewsAccordingToBooking`}
          listItems={[
            { key: t`guestsReviews`, value: tourPackage.hotel?.travellersRating },
            { key: t`cleanliness`, value: tourPackage.hotel?.cleanliness }
          ]}
        />
        <HotelPackageDescription tourPackage={tourPackage} />
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
