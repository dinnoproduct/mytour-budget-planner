'use client'

import { useState } from 'react'
import { Box, Flex, Image } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Button, Heading, Text } from '@ui'
import {
  CYPRUS_VISA_DOCUMENTS_PDF_URL,
  CYPRUS_VISA_SUPPORT_IMAGE_URL,
} from '../model/constants'
import { CyprusVisaSupportModal } from './CyprusVisaSupportModal'

export const CyprusVisaSupportBanner = () => {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const hasDocumentsLink = Boolean(CYPRUS_VISA_DOCUMENTS_PDF_URL)
  const hasImage = Boolean(CYPRUS_VISA_SUPPORT_IMAGE_URL)

  return (
    <>
      <Box
        w="full"
        mx="auto"
        px={{ base: 4, md: 10 }}
      >
        <Flex
          direction={{ base: 'column', md: 'row' }}
          overflow="hidden"
          gap={{ base: 4, md: 10 }}
          align="center"
        >
          <Flex
            flex={1}
            direction="column"
            align={{ base: "center", md: "flex-start" }}
            p={{ base: 6, md: 10 }}
            gap={4}
          >
            <Text
              as="h2"
              size={{ base: '2xl', md: '4xl' }}
              fontWeight="bold"
              color="gray.800"
              align={{ base: "center", md: "left" }}
            >
              {t('cyprusVisa.title')}
            </Text>

            <Text size={{ base: 'lg', md: 'xl' }} color="gray.600" fontWeight="normal"
              align={{ base: "center", md: "left" }}
            >
              {t('cyprusVisa.description')}
            </Text>

            <Flex mt={4} gap={4} align={{ base: "center", md: "center" }} justify={{ base: "center", md: "flex-start" }} flexDirection={{ base: "column", md: "row" }}>
              <Button
                variant="solid-blue"
                size={"lg"}
                onClick={() => setIsModalOpen(true)}
              >
                {t('cyprusVisa.applyButton')}
              </Button>
              {
                hasDocumentsLink ? (
                  <Button
                    variant="text-blue"
                    size="md"
                    href={CYPRUS_VISA_DOCUMENTS_PDF_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    px={0}
                  >
                    {t('cyprusVisa.documentsLink')}
                  </Button>
                ) : null}
            </Flex>

          </Flex>

          <Box
            flex={1}
            minH={{ base: '200px', md: 'auto' }}
          >
            <Image
              src={CYPRUS_VISA_SUPPORT_IMAGE_URL}
              alt=""
              w="full"
              h="full"
              minH={{ base: '200px', md: '280px' }}
              maxH={{ base: '600px', md: '660px' }}
              objectFit="cover"
            />
          </Box>
        </Flex>
      </Box >

      <CyprusVisaSupportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
