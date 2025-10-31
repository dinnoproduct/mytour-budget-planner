import { Box, VStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { type FAQCategory, FAQ_CATEGORIES } from './faqData'

type CategoriesSidebarProps = {
  categories: FAQCategory[]
  selectedCategory: FAQCategory
  onSelect: (c: FAQCategory) => void
}

export const CategoriesSidebar = ({ categories, selectedCategory, onSelect }: CategoriesSidebarProps) => {
  const { t } = useTranslation()

  return (
    <Box width={{ base: 'full', sm: '250px', lg: '300px' }} position={{ base: 'relative', md: 'sticky' }} top={{ md: 5 }} flexShrink={0}>
      <VStack align="stretch" spacing={0}>
        {categories.map((category) => (
          <Box
            key={category}
            as="button"
            onClick={() => onSelect(category)}
            pl={4}
            pr={3}
            pt={3}
            pb={3}
            textAlign="left"
            borderRadius="xl"
            bg={selectedCategory === category ? 'gray.50' : 'transparent'}
            color={selectedCategory === category ? 'blue.500' : 'gray.700'}
            fontWeight={500}
            fontSize="18px"
            lineHeight="28px"
            _hover={{ bg: 'gray.50' }}
            transition="all 0.2s"
          >
            {t(FAQ_CATEGORIES[category])}
          </Box>
        ))}
      </VStack>
    </Box>
  )
}


