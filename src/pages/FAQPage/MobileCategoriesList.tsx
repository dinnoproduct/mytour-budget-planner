import { Box, HStack, VStack, Text } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { useTranslation } from 'react-i18next'
import { type FAQCategory, FAQ_CATEGORIES } from './faqData'

type MobileCategoriesListProps = {
  categories: FAQCategory[]
  onSelect: (c: FAQCategory) => void
}

export const MobileCategoriesList = ({ categories, onSelect }: MobileCategoriesListProps) => {
  const { t } = useTranslation()
  return (
    <Box borderRadius="2xl" px={0} py={2}>
      <VStack align="stretch" spacing={1}>
        {categories.map((category) => (
          <HStack
            key={category}
            as="button"
            onClick={() => onSelect(category)}
            justify="space-between"
            pl={4}
            pr={3}
            pt={4}
            pb={4}
            bg="white"
            borderRadius="xl"
          >
            <Text fontSize="18px" lineHeight="28px" fontWeight={500} color="gray.700" textAlign="left">
              {t(FAQ_CATEGORIES[category])}
            </Text>
            <ChevronRightIcon color="blue.500" />
          </HStack>
        ))}
      </VStack>
    </Box>
  )
}


