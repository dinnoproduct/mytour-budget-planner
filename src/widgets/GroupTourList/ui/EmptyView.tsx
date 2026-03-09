import { EmptyState } from '@ui'
import { useTranslation } from 'react-i18next'

export const EmptyView = () => {
  const { t } = useTranslation()
  
  return (
    <EmptyState
      illustrationName="error"
      mt={{ base: '160px', md: '190px' }}
      mb={{ base: '160px', md: '150px' }}
      text={t`filterGroupTourNotFound`}
    />
  ) 
}
