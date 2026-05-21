import { Box, Button, ListItem, UnorderedList } from '@chakra-ui/react'
import { Text } from '@ui'
import {
  type DictionaryTypes,
  PACKAGE_FACILITY_ICON_MAP,
  type PackageEntity,
  useDictionary
} from '@entities/package'
import { SummaryCard } from '@widgets/PackageDetails/ui/SummaryCard'
import { useMemo, useState } from 'react'
import { LANGUAGE_PREFIX, type LanguageName } from '@shared/model'
import { useTranslation } from 'react-i18next'

export const HotelPackageDescription = ({
  tourPackage
}: {
  tourPackage: PackageEntity
}) => {
  const { i18n, t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)



  const hotelDescription = useMemo(() => {
    const key =
      `description${LANGUAGE_PREFIX[i18n.language as LanguageName]}` as keyof PackageEntity['hotel']

    return (tourPackage?.hotel[key] as string) || ''
  }, [i18n.language, tourPackage?.hotel.descriptionArm])

  const shouldShowToggle = hotelDescription.trim().length > 220

  return (
    <Box p={4} pt={0}>
      <Text noOfLines={isExpanded ? undefined : 4}>{hotelDescription}</Text>
      {shouldShowToggle && (
        <Button
          onClick={() => setIsExpanded((v) => !v)}
          variant="link"
          mt="2"
          color="blue.500"
          alignSelf="flex-start"
        >
          {isExpanded ? t('readLess') : t('readMore')}
        </Button>
      )}
    </Box>
  )
}
