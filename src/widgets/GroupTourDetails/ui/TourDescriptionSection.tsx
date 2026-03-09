import { Box } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Text } from '@ui'

type TourDescriptionSectionProps = {
  descriptionHtml: string
}

export const TourDescriptionSection = ({ descriptionHtml }: TourDescriptionSectionProps) => {
  const { t } = useTranslation()
  if (!descriptionHtml) return null

  return (
    <Box>
      <Text size={{ base: 'md', md: 'lg' }} mb={4} fontWeight="bold" as="h2">
        {t('groupTourDescriptionTitle')}
      </Text>
      <Box
        sx={{
          '& p': { color: 'gray.800', fontSize: 'md', lineHeight: 'md', fontWeight: '400' },
        }}
        color="gray.700"
        whiteSpace="pre-wrap"
        as="div"
        dangerouslySetInnerHTML={{ __html: descriptionHtml }}
      />
    </Box>
  )
}
