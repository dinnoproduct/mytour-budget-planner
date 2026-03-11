import { Box, Flex, HStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Text, Icon } from '@ui'
import type { GroupTourRouteItem } from '@entities/package'
import { getLocalizedRouteItem } from '../lib/utils'

type IncludedExcludedSectionProps = {
  included?: GroupTourRouteItem[]
  excluded?: GroupTourRouteItem[]
  languageSuffix: string
}

export const IncludedExcludedSection = ({
  included = [],
  excluded = [],
  languageSuffix,
}: IncludedExcludedSectionProps) => {
  const { t } = useTranslation()
  const hasIncluded = included.length > 0
  const hasExcluded = excluded.length > 0
  if (!hasIncluded && !hasExcluded) return null

  return (
    <Box mb="8" px={{ base: '4', md: '0' }}>
      {(hasIncluded || hasExcluded) && (
          <Text size={{ base: 'md', md: 'lg' }} mb={6} fontWeight="bold" as="h2">{t('groupTour.whatsIncludedWhatsNot')}</Text>
        )}
      <Flex
        direction={{ base: 'column', md: 'row' }}
        gap={{ base: 6, md: 8 }}
        align={{ base: 'stretch', md: 'flex-start' }}
      >
        
        {hasIncluded && (
          <Box flex={1} minW={0}>
            <Flex direction="column" gap={2}>
              {included.map((item, idx) => {
                const label = getLocalizedRouteItem(item, languageSuffix)
                if (!label) return null
                return (
                  <HStack key={idx} spacing={2} align="flex-start">
                    <Icon name="check" size="16" color="green.500" flexShrink={0} mt="2px" />
                    <Text size="sm" color="gray.700">
                      {label}
                    </Text>
                  </HStack>
                )
              })}
            </Flex>
          </Box>
        )}
        {hasExcluded && (
          <Box flex={1} minW={0}>
            <Flex direction="column" gap={2}>
              {excluded.map((item, idx) => {
                const label = getLocalizedRouteItem(item, languageSuffix)
                if (!label) return null
                return (
                  <HStack key={idx} spacing={2} align="flex-start">
                    <Icon name="close" size="16" color="red.500" flexShrink={0} mt="2px" />
                    <Text size="sm" color="gray.700">
                      {label}
                    </Text>
                  </HStack>
                )
              })}
            </Flex>
          </Box>
        )}
      </Flex>
    </Box>
  )
}
