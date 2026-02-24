import { Flex, Box, Grid } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { LanguageLink } from '@/components/LanguageLink/LanguageLink'
import { Text } from '@ui'

export const BlogsSectionLayout: React.FC<BlogsSectionLayoutProps> = ({
  children
}) => {
  const { t } = useTranslation()

  return (
    <Box
      px={{ base: 4, md: 6 }}
      py={{ base: 8, md: 16 }}
      bgColor="gray.50"
      mt={{ base: 8, md: 16 }}
    >
      <Box maxWidth="1376px" mx="auto">
        <Box>
          <Flex align="center" width="full" justify="space-between">
            <Text
              size={{
                base: 'lg',
                md: '3xl'
              }}
              color="gray.800"
              fontWeight="bold"
              as="h2"
            >
              {t`blogsSectionTitle`}
            </Text>

            <LanguageLink to="/blogs">
              <Text
                size="lg"
                color="blue.500"
                mr={{ base: 0, md: 2 }}
                cursor="pointer"
              >
                {t`more`}
              </Text>
            </LanguageLink>
          </Flex>

          <Grid
            mt="8"
            templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
            gap="8"
            justifyItems="center"
          >
            {children}
          </Grid>
        </Box>
      </Box>
    </Box>
  )
}
