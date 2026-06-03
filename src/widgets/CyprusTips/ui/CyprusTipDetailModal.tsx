'use client'

import {
  AspectRatio,
  Box,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  chakra,
} from '@chakra-ui/react'
import { type ExternalTip } from '@entities/notification'
import { useTranslation } from 'react-i18next'
import { getTipLocalizedText } from '../lib/getTipLocalizedText'
import { getYoutubeEmbedUrl } from '../lib/getYoutubeEmbedUrl'

const VideoIframe = chakra('iframe')
const VideoElement = chakra('video')

type CyprusTipDetailModalProps = {
  tip: ExternalTip | null
  isOpen: boolean
  onClose: () => void
}

export const CyprusTipDetailModal = ({
  tip,
  isOpen,
  onClose,
}: CyprusTipDetailModalProps) => {
  const { i18n } = useTranslation()

  if (!tip) {
    return null
  }

  const title = getTipLocalizedText(tip.title, i18n.language)
  const description = getTipLocalizedText(tip.description, i18n.language)
  const youtubeEmbedUrl =
    tip.type === 'VIDEO' ? getYoutubeEmbedUrl(tip.mediaUrl) : null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: 'full', md: '2xl' }}
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent mx={{ base: 0, md: 4 }} rounded={{ base: 'none', md: 'xl' }}>
        <ModalHeader pr={12}>
          <Text fontSize="lg" fontWeight="semibold" color="gray.800">
            {title}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {tip.type === 'IMAGE' && tip.mediaUrl ? (
            <Image
              src={tip.mediaUrl}
              alt={title}
              w="full"
              maxH={{ base: '70vh', md: '600px' }}
              objectFit="contain"
              rounded="lg"
            />
          ) : null}

          {tip.type === 'VIDEO' && youtubeEmbedUrl ? (
            <AspectRatio ratio={16 / 9} maxW="full">
              <VideoIframe
                src={youtubeEmbedUrl}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                w="full"
                h="full"
                border="none"
                rounded="lg"
              />
            </AspectRatio>
          ) : null}

          {tip.type === 'VIDEO' && !youtubeEmbedUrl && tip.mediaUrl ? (
            <VideoElement
              src={tip.mediaUrl}
              controls
              w="full"
              maxH={{ base: '70vh', md: '600px' }}
              rounded="lg"
            />
          ) : null}

          {description ? (
            <Text mt={4} color="gray.600" fontSize="sm">
              {description}
            </Text>
          ) : null}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
