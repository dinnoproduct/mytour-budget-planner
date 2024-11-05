import { Box, Grid } from '@chakra-ui/react'
import { type LayoutProps } from './types'
import { Container, Heading, Tabs } from '@ui'
import { useUserRequestsManager } from '@widgets/UserPackages/hooks'
import { RequestCard } from '@widgets/UserPackages/ui/RequestCard'
import {
  CanceledTabEmptyState,
  PastTabEmptyState,
  UpcomingTabEmptyState
} from '@widgets/UserPackages/ui/EmptyStates.tsx'
import { useTranslation } from 'react-i18next'

export const UserPackages = () => {
  const { t } = useTranslation()
  const {
    activeRequests,
    pendingRequests,
    cancelledRequests,
    passedRequests,
    handleRemainingPaymentClick,
    isLoadingRemainingPayment,
    currentRequestId,
    handleCancelClick,
    tab,
    handleTabChange,
    isLoadingUserRequests
  } = useUserRequestsManager()

  return (
    <Layout>
      <Heading size="sm-md">{t`myPackages`}</Heading>

      <Tabs
        labels={[t`upcoming`, t`past`, t`canceled`]}
        mt="10"
        index={tab}
        onChange={handleTabChange}
      >
        {!activeRequests?.length ? (
          <UpcomingTabEmptyState isLoading={isLoadingUserRequests} />
        ) : (
          <TabContentLayout>
            {activeRequests.map(request => (
              <RequestCard
                request={request}
                key={request.id}
                onRemainingPaymentClick={handleRemainingPaymentClick}
                isLoadingRemainingPayment={
                  currentRequestId === request.id && isLoadingRemainingPayment
                }
                onCancelClick={handleCancelClick}
                status="upcoming"
              />
            ))}
          </TabContentLayout>
        )}

        {!passedRequests?.length ? (
          <PastTabEmptyState isLoading={isLoadingUserRequests} />
        ) : (
          <TabContentLayout>
            {passedRequests.map(request => (
              <RequestCard request={request} key={request.id} status="past" />
            ))}
          </TabContentLayout>
        )}

        {!cancelledRequests?.length ? (
          <CanceledTabEmptyState isLoading={isLoadingUserRequests} />
        ) : (
          <TabContentLayout>
            {cancelledRequests.map(request => (
              <RequestCard
                request={request}
                key={request.id}
                status="canceled"
              />
            ))}
          </TabContentLayout>
        )}
      </Tabs>
    </Layout>
  )
}

const TabContentLayout = ({ children }: LayoutProps) => (
  <Grid
    templateColumns={{
      base: '1fr',
      md: 'repeat(4, minmax(240px, 1fr))'
    }}
    columnGap={{ base: 4, lg: 6 }}
    rowGap="4"
    justifyItems={{ base: 'center', md: 'stretch' }}
  >
    {children}
  </Grid>
)

const Layout = ({ children }: LayoutProps) => (
  <Box py={{ base: 6, md: 10 }}>
    <Container>{children}</Container>
  </Box>
)
