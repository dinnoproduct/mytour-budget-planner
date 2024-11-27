import { type PackageDetailsProps } from './types.ts'
import { Divider, Flex } from '@chakra-ui/react'
import { SectionLayout } from '@widgets/PackageDetails/ui/SectionLayout.tsx'
import { formatDate } from '@widgets/PackageDetails/utils'
import { useTranslation } from 'react-i18next'
import { PackageDescription } from '@widgets/PackageDetails/ui/PackageDescription.tsx'
import { CompanyPolicy } from '@widgets/PackageDetails/ui/CompanyPolicy.tsx'
import { type DictionaryTypes, useDictionary } from '@entities/package'
import { useMemo } from 'react'

export const HotelPackageDetails = ({ tourPackage }: PackageDetailsProps) => {
  const { t } = useTranslation()
  console.log('HotelPackageDetails@tourPackage : ', tourPackage)

  const { data: foodTypes = [] } = useDictionary(
    'FoodTypeDictionary' as DictionaryTypes.FoodTypeDictionary
  )

  const foodType = useMemo<string>(
    () =>
      foodTypes.find(({ key }) => key === tourPackage.foodType)?.value || '',
    [JSON.stringify(foodTypes)]
  )

  return (
    <Flex direction="column" mt={{ base: 5, md: 0 }}>
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

      <PackageDescription tourPackage={tourPackage} />

      <Divider my={{ base: 5, md: 10 }} />

      <CompanyPolicy tourPackage={tourPackage} />
    </Flex>
  )
}

export { HotelPackageDetailsHeader } from './HotelPackageDetailsHeader.tsx'
