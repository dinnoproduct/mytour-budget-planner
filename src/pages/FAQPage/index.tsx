import { useState } from 'react'
import { FaqBanner } from './FaqBanner'
import { FaqContent } from './FaqContent'
import { CtaBanner } from './CtaBanner'
import { PageLayout } from '@/shared/ui/layout/PageLayout'

export const FAQPage = () => {
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false)

  return (
    <PageLayout background="white">
      {!isMobileCategoryOpen && <FaqBanner />}
      <FaqContent onMobileCategoryOpenChange={setIsMobileCategoryOpen} />
      <CtaBanner />
    </PageLayout>
  )
}

