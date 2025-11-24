import { PackageSearch } from '@widgets/PackageSearch'
import { PackageList } from '@widgets/PackageList'
import { PageLayout } from '@/shared/ui/layout/PageLayout'

export const PackageListPage = () => (
  <PageLayout showFooter={false}>
    <PackageSearch variant="fixedWithoutTabs" showTabs={false} />
    <PackageList />
  </PageLayout>
)
