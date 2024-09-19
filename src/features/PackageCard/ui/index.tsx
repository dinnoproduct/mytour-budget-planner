import { Box, LinkProps, Link, Flex } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { numberWithCommaNormalizer } from '@/utils/normalizers.ts'
import ImageSlider from './ImageSlider.tsx'
import { ReactNode, useMemo } from 'react'
import { LANGUAGE_PREFIX } from '@shared/model'
import { Language } from '@widgets/Header/model'
import { Text } from '@ui'
import { Link as ReactLink } from 'react-router-dom'
import { PackageCardProps } from '@features/PackageCard/ui/types.ts'
import { PackageCity, PackageCountry, PackageEntity } from '@entities/package'

export const PackageCard = ({ tourPackage = {}, link, ...props }: PackageCardProps) => {
	const { i18n, t } = useTranslation()

	const languageSuffix = useMemo(() => {
		return LANGUAGE_PREFIX[i18n.language as Language['name']]
	}, [i18n.language])

	const cityLabel = useMemo(() => {
		return (tourPackage.city as PackageCity)['name' + languageSuffix as keyof PackageCity] as string
	}, [tourPackage.city, languageSuffix])

	const countryLabel = useMemo(() => {
		return (tourPackage.city.country as PackageCountry)['name' + languageSuffix as keyof PackageCountry] as string
	}, [tourPackage.city.country, languageSuffix])

	const packageName = useMemo(() => {
		return tourPackage['name' + languageSuffix as keyof PackageEntity] as string
	}, [tourPackage, languageSuffix])

	const childrenTravelers = useMemo(() => {
		const childrenCount = tourPackage?.childrenTravelers + tourPackage?.infantTravelers

		if (childrenCount === 0) return ''

		return `, ${childrenCount} ${t`child`.toLowerCase()}`
	},[tourPackage?.childrenTravelers, tourPackage?.infantTravelers, languageSuffix])


	return (
		<Layout
			link={link}
			{...props}
		>
			<ImageSlider
				images={tourPackage.hotel.images}
				starsCount={tourPackage.hotel.stars}
			/>

			<Box py="4">
				<Box px="4">
					<Text
						color="gray.800" size="sm" fontWeight="semibold"
						noOfLines={1}
					>
						{packageName}
					</Text>

					<Text size="sm" color="gray.600" mt="1">
						{cityLabel}, {countryLabel}
					</Text>
				</Box>

				<Box mt="4" px="4">
					<Flex align="center">
						<Text size="lg" fontWeight="bold" color="gray.800">
							{numberWithCommaNormalizer(tourPackage.price)} ֏
						</Text>

						{/*{tourPackage.hotOffer ?*/}
						{/*	<Text size="sm" fontWeight="normal" color="red.500" textDecoration="line-through" ml="2">*/}
						{/*		{numberWithCommaNormalizer(tourPackage.oldPrice)} ֏*/}
						{/*	</Text>*/}
						{/*	: null}*/}
					</Flex>

					<Text mt="1" size="sm" color="gray.600">
						{tourPackage.adultTravelers} {t`adult`}{childrenTravelers} • {tourPackage.nights} {t`night`}
					</Text>
				</Box>
			</Box>
		</Layout>
	)
}

const Layout = ({ children, link, ...props }: {children: ReactNode | ReactNode[], link: string} & LinkProps) => {
	return (
		<Link
			as={ReactLink}
			to={link}
			_hover={{ textTransform: 'none' }}
			{...props}
		>
			<Box
				maxWidth="362px"
				width="full"
				rounded="lg"
				overflow="hidden"
				border="1px solid"
				borderColor="gray.200"
			>
				{children}
			</Box>
		</Link>
	)
}