import { Box, ListItem, UnorderedList } from '@chakra-ui/react'
import { Text } from '@ui'
import { DictionaryTypes, PACKAGE_FACILITY_ICON_MAP, PackageEntity, useDictionary } from '@entities/package'
import { SummaryCard } from '@widgets/PackageDetails/ui/SummaryCard.tsx'
import { useMemo } from 'react'
import { LANGUAGE_PREFIX, LanguageName } from '@shared/model'
import { useTranslation } from 'react-i18next'

export const PackageDescription = ({ tourPackage }: {tourPackage: PackageEntity}) => {
	const { i18n } = useTranslation()
	const { data: facilities=[] } = useDictionary('FacilityDictionary' as DictionaryTypes.FacilityDictionary)

	const hotelFacilities = useMemo(() => {
		if (!facilities.length || !tourPackage.hotel?.facilities) {
			return []
		}

		return facilities.filter(({ key }) => tourPackage.hotel?.facilities & key)

	}, [facilities?.length, tourPackage.hotel?.facilities])

	const hotelDescription = useMemo(() => {
		const key = `description${LANGUAGE_PREFIX[i18n.language as LanguageName]}` as keyof PackageEntity['hotel']
		return tourPackage?.hotel[key] as string || ''
	}, [i18n.language, tourPackage?.hotel.descriptionArm])

	return (
		<Box mt="8" px={{base: '4', md: '0'}}>
			<Text>
				{hotelDescription}
			</Text>

			<UnorderedList
			 listStyleType="none"
			 spacing="4"
			 mx="0"
			 mt="4"
			>
				{hotelFacilities?.map(({key, value}) => (
					<ListItem>
						<SummaryCard
							iconName={PACKAGE_FACILITY_ICON_MAP[key]}
						  children={value}
						/>
					</ListItem>
				))}
			</UnorderedList>
		</Box>
	)
}
