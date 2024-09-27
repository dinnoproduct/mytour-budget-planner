import { Box, Flex } from '@chakra-ui/react'
import { Button, Heading, HotelStarBadge, Text } from '@ui'
import { PackageEntity } from '@entities/package'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { LANGUAGE_PREFIX, LanguageName } from '@shared/model'

export const PackageDetailsHeader = ({ tourPackage, onMoreImagesClick }: {tourPackage: PackageEntity, onMoreImagesClick: () => void}) => {
	const {t, i18n} = useTranslation()

	const countryName = useMemo(() => {
		const key = `name${LANGUAGE_PREFIX[i18n.language as LanguageName]}` as keyof PackageEntity['city']['country']
		return tourPackage?.city.country[key] as string || ''
	}, [i18n.language, tourPackage?.city.country.nameArm])

	const cityName = useMemo(() => {
		const key = `name${LANGUAGE_PREFIX[i18n.language as LanguageName]}` as keyof PackageEntity['city']
		return tourPackage?.city[key] as string || ''
	}, [i18n.language, tourPackage?.city.nameArm])

	return (
		<Flex px={{base: '4', md: '0'}}>
			<Flex direction="column">
				<Flex align="center">
					<Heading
						as="h1"
						size={{base: 'sm-sm', md: 'lg'}}
						color="gray.800"
						display="inline-block"
					>{tourPackage.nameEng}</Heading>

					<HotelStarBadge starsCount={tourPackage.hotel.stars} ml="2"/>
				</Flex>

				<Text
					size={{ base: 'sm', md: 'md' }}
					color="gray.800"
					mt="2"
					fontWeight="medium"
				>{countryName}, {cityName}</Text>
			</Flex>

			<Button variant="text-blue" onClick={onMoreImagesClick} ml="auto" display={{base: 'none', md: 'inline-flex'}}>
				{t`viewAllPhotos`}
			</Button>
		</Flex>
	)
}
