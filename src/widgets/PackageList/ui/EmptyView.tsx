import { EmptyState } from '@ui'
import { type EmptyViewProps } from '@widgets/PackageList/ui/types.ts'
import { useTranslation } from 'react-i18next'

export const EmptyView = ({ searchView }: EmptyViewProps) => {
  const { t } = useTranslation()

  switch (searchView) {
    case 'packages':
      return (
        <EmptyState
          illustrationName="error"
          mt={{ base: '160px', md: '200px' }}
          text={t`packagesNotFoundText`}
        />
      )
    case 'hotel':
      return (
        <EmptyState
          illustrationName="error"
          mt={{ base: '160px', md: '200px' }}
          text={t`hotelPackagesNotFoundText`}
        />
      )

    case 'filter-packages':
      return (
        <EmptyState
          illustrationName="error"
          mt={{ base: '160px', md: '200px' }}
          text={t`filterPackageNotFound`}
        />
      )
    case 'filter-hotel':
      return (
        <EmptyState
          illustrationName="error"
          mt={{ base: '160px', md: '200px' }}
          text={t`filterHotelNotFound`}
        />
      )
    default:
      break
  }
}
