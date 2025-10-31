import { Box } from '@chakra-ui/react'
import { useState } from 'react'
import { Footer } from '@ui'
import { Header } from '@widgets/Header'
import { FaqBanner } from './FaqBanner'
import { FaqContent } from './FaqContent'
import { CtaBanner } from './CtaBanner'

export const FAQPage = () => {
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false)

  return (
    <Box overflowX="hidden" background="white">
      <Header />
      {!isMobileCategoryOpen && <FaqBanner />}
      <FaqContent onMobileCategoryOpenChange={setIsMobileCategoryOpen} />
      <CtaBanner />
      <Footer />
    </Box>
  )
}

