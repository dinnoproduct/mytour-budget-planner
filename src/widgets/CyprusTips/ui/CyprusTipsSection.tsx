'use client'

import { Box } from '@chakra-ui/react'
import { useExternalTips, type ExternalTip } from '@entities/notification'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Heading } from '@ui'
import { CyprusTipDetailModal } from './CyprusTipDetailModal'
import {
  CyprusTipsCarousel,
  CyprusTipsCarouselSkeleton,
} from './CyprusTipsCarousel'

export const CyprusTipsSection = () => {
  const { t } = useTranslation()
  const { data: tips = [], isLoading, isError } = useExternalTips()
  const [selectedTip, setSelectedTip] = useState<ExternalTip | null>(null)

  const sortedTips = useMemo(
    () => [...tips].sort((a, b) => a.displayOrder - b.displayOrder),
    [tips],
  )

  if (!isLoading && (isError || sortedTips.length === 0)) {
    return null
  }

  return (
    <Box
      w="full"
      maxW="1440px"
      mx="auto"
      px={{ base: 4, md: 10 }}
      mt={{ base: 10, md: 12 }}
      mb={{ base: 6, md: 8 }}
    >
      <Heading
        as="h2"
        fontSize={{ base: 'text-xl', md: 'heading-sm-md' }}
        lineHeight={{ base: 'text-xl', md: 'heading-sm-md' }}
        color="gray.800"
        mb={{ base: 6, md: 8 }}
      >
        {t('cyprusTips.sectionTitle')}
      </Heading>

      {isLoading ? (
        <CyprusTipsCarouselSkeleton />
      ) : (
        <CyprusTipsCarousel
          tips={sortedTips}
          onTipClick={(tip) => setSelectedTip(tip)}
        />
      )}

      <CyprusTipDetailModal
        tip={selectedTip}
        isOpen={Boolean(selectedTip)}
        onClose={() => setSelectedTip(null)}
      />
    </Box>
  )
}
