import { EmptyState } from '@ui'
import { type EmptyViewProps } from '@widgets/PackageList/ui/types.ts'
import { useTranslation } from 'react-i18next'

export const EmptyView = ({ searchView }: EmptyViewProps) => {
  const { t } = useTranslation()

  if (searchView === 'packages') {
    return (
      <EmptyState
        illustrationName="error"
        mt={{ base: '160px', md: '200px' }}
        text={t`packagesNotFoundText`}
      />
    )
  } else {
    return (
      <EmptyState
        illustrationName="error"
        mt={{ base: '160px', md: '200px' }}
        text={t`hotelPackagesNotFoundText`}
      />
    )
  }
}
