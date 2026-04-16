import { EmptyState } from '@ui'
import { useTranslation } from 'react-i18next'
import { type EmptyStateProps } from '@widgets/UserPackages/ui/types'
import { Grid, Spinner } from '@chakra-ui/react'
import {Loader, LoaderWithText} from '@/components/Loader/Loader'

export const UpcomingTabEmptyState = ({ isLoading }: EmptyStateProps) => {
  const { t } = useTranslation()

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <EmptyState
      illustrationName="error"
      text={t`upcomingRequestsEmptyText`}
      buttonLabel={t`planYourTrip`}
      buttonProps={{
        to: '/'
      }}
      mt={{ base: '40px', md: '60px' }}
      px="0"
    />
  )
}

export const IncompleteTabEmptyState = ({ isLoading }: EmptyStateProps) => {
  const { t } = useTranslation()

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <EmptyState
      illustrationName="error"
      text={t`incompleteRequestsEmptyText`}
      mt={{ base: '40px', md: '60px' }}
      px="0"
    />
  )
}

export const PastTabEmptyState = ({ isLoading }: EmptyStateProps) => {
  const { t } = useTranslation()

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <EmptyState
      illustrationName="error"
      text={t`pastRequestsEmptyText`}
      mt={{ base: '40px', md: '60px' }}
      px="0"
    />
  )
}

export const CanceledTabEmptyState = ({ isLoading }: EmptyStateProps) => {
  const { t } = useTranslation()

  if (isLoading) {
    return <LoadingState /> 
  }

  return (
    <EmptyState
      illustrationName="error"
      text={t`canceledEmptyText`}
      mt={{ base: '40px', md: '60px' }}
      px="0"
    />
  )
}

const LoadingState = () => {
  const { t } = useTranslation()

  return (
    <Grid
      width="full"
      placeItems="center"
      mt={{ base: '40px', md: '60px' }}
    >
      <LoaderWithText
        loading={true}
        title={t('loading.mypackages.title')}
        description={t('loading.mypackages.description')}
        style={{
          textAlign: 'center',
        }}
      />
    </Grid>
  )
}
