import { type PackageDetailsProps } from './types.ts'
import { Flex } from '@chakra-ui/react'
import { SectionLayout } from './SectionLayout.tsx'
import { formatDate } from '../utils'
import { useTranslation } from 'react-i18next'
import { HotelPackageDescription } from './HotelPackageDescription.tsx'
import { CardSectionLayout } from '@/shared/ui/layout/CardSectionLayout.tsx'

export const HotelPackageDetails = ({ tourPackage }: PackageDetailsProps) => {
  const { t } = useTranslation()

  return (
    <Flex direction="column" mt={{ base: 5, md: 0 }}>
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
    </Flex>
  )
}

export { HotelPackageDetailsHeader } from './HotelPackageDetailsHeader.tsx'
