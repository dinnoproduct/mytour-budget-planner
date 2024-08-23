import { Box, Link, LinkProps } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { numberWithCommaNormalizer } from '../../../utils/normalizers.ts'
import { PackagesFields } from '../../../modules/packages/data/packagesEnums.ts'
import ImageSlider from './ImageSlider.tsx'
import { ReactNode, useMemo } from 'react'
import { LANGUAGE_PREFIX } from '../../../shared/model'
import { Language } from '../../../widgets/Header/model'
import { Text } from '@ui'

export const PackageCard = ({ tourPackage = {}, ...props }: {tourPackage: any} & LinkProps) => {
	console.log('tourPackage', tourPackage)
	const { i18n, t } = useTranslation()

	const languageSuffix = useMemo(() => {
		return LANGUAGE_PREFIX[i18n.language as Language['name']]
	}, [i18n.language])

	return (
		<Layout {...props}>
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
						{tourPackage['name' + languageSuffix]}
					</Text>

					<Text size="sm" color="gray.600" mt="1">
						{tourPackage.city.country['name' + languageSuffix]}, {tourPackage.city['name' + languageSuffix]}
					</Text>
				</Box>

				<Box mt="4" px="4">
					<Text size="lg" fontWeight="bold" color="gray.800">
						{numberWithCommaNormalizer(tourPackage[PackagesFields.price])} ֏
					</Text>

					<Text mt="1" size="sm" color="gray.600">
						{tourPackage.adultTravelers} {t`adult`} • {tourPackage.nights} {t`night`}
					</Text>
				</Box>
			</Box>
		</Layout>
	)
}

const Layout = ({ children, ...props }: {children: ReactNode | ReactNode[]} & LinkProps) => {
	return (
		<Link _hover={{ textTransform: 'none' }} {...props}>
			<Box
				maxWidth="328px"
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