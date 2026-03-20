import { BlogsList } from '@widgets/BlogsList'
import { BlogsSlider } from '@widgets/BlogsSlider'
import { PageLayout } from '@/shared/ui/layout/PageLayout'

export const BlogsPage = () => (
  <PageLayout>
    <BlogsSlider />
    <BlogsList mt={{ sm: '-138px' }} />
  </PageLayout>
)
