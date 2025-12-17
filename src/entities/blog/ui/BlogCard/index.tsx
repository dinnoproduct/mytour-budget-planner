import React, { useMemo } from 'react'
import { Box, Grid, Link } from '@chakra-ui/react'
import { Text } from '@ui'
import moment from 'moment'
import { useTranslation } from 'react-i18next'

type BlogCardProps = {
  title: string
  description: string
  date: Date
  imageUrl: string
  link: string
}

export const BlogCard: React.FC<BlogCardProps> = ({
  title,
  description,
  date,
  imageUrl,
  link
}) => {
  const { t } = useTranslation()

  const publishDate = useMemo(() => {
    if (!date) {
      return ''
    }

    const momentDate = moment(date)

    const longMonthName = momentDate.locale('en').format('MMMM').toLowerCase()
    const shortMonthName = t(`${longMonthName}Short`).toUpperCase()

    return `${shortMonthName} ${momentDate.format('D')}, ${momentDate.format('YYYY')}`
  }, [date, t])

  return (
    <Link href={link} isExternal _hover={{ textTransform: 'none' }}>
      <Box
        borderRadius="12px"
        height={{ base: '392px', md: '460px' }}
        boxShadow="md"
        overflow="hidden"
        maxWidth="442px"
      >
        <Box
          height={{ base: '176px', lg: '190px' }}
          backgroundImage={`url(${imageUrl})`}
          backgroundSize="cover"
        />

        <Grid
          p="6"
          position="relative"
          height={{ base: 'calc(100% - 176px)', lg: 'calc(100% - 190px)' }}
        >
          <Box>
            <Text
              variant="text-lg"
              color="gray.800"
              noOfLines={3}
              fontWeight="semibold"
            >
              {title}
            </Text>

            <Text variant="text-sm" color="gray.600" mt="8px" noOfLines={3}>
              {description}
            </Text>
          </Box>

          <Text variant="text-sm" color="gray.600" mt="auto">
            {publishDate}
          </Text>
        </Grid>
      </Box>
    </Link>
  )
}
