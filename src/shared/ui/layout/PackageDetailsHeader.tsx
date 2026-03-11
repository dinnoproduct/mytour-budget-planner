import React from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { Button } from '@ui'
import { useTranslation } from 'react-i18next'

interface PackageDetailsHeaderProps {
  onBackClick: () => void
  packageType?: 'package' | 'hotel',
  title?: string
}

export const PackageDetailsHeader: React.FC<PackageDetailsHeaderProps> = ({ 
  onBackClick, 
  packageType = 'package',
  title = ''
}) => {
  const { t } = useTranslation()

  return (
    <Box height="80px">
      <Flex
        height="80px"
        width="full"
        alignItems="center"
        px={{ base: 4, md: 6 }}
        borderBottom="1px solid"
        borderColor="gray.100"
        position={{ base: 'fixed', md: 'static' }}
        bgColor="white"
        zIndex="3"
      >
        <Button
          variant="text-blue"
          iconBefore="arrow-back"
          onClick={onBackClick}
        >
          {packageType === 'hotel' ? t`hotels` : title}
        </Button>
      </Flex>
    </Box>
  )
}
