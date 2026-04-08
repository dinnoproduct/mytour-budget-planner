import { EmptyState } from '@ui'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

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

export const EmptyViewWithAfterSearch = () => {
  const { t } = useTranslation()
  const [, setSearchParams] = useSearchParams()

  const handleResetFilters = () => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.set('tab', 'group-tours')
      next.delete('groupTourMonths')
      next.delete('groupTourRouteCountries')
      return next
    }, { replace: true })
  }

  return (
    <EmptyState
      illustrationName="error"
      mt={{ base: '160px', md: '190px' }}
      mb={{ base: '160px', md: '150px' }}
      text={t`groupToursEmptyFilterText`}
      buttonLabel={t`groupToursEmptyFilterTextAction`}
      buttonProps={{
        onClick: handleResetFilters
      }}
    />
  )
}
