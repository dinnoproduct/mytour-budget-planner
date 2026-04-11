import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Box,
  Image,
  VStack,
} from '@chakra-ui/react'
import { useCallback } from 'react'
import { Button, Text } from '@ui'
import { type SplashNotification } from '../api/types.ts'
import { useLanguageNavigate } from '@/hooks/useLanguageNavigate.ts'

interface SplashNotificationModalProps {
  notification: SplashNotification
  isOpen: boolean
  onClose: () => void
  onCtaClick: () => void
}

export const SplashNotificationModal = ({
  notification,
  isOpen,
  onClose,
  onCtaClick,
}: SplashNotificationModalProps) => {
  const { title, description, cta, asset } = notification
  const { navigateTo } = useLanguageNavigate()

  const handleCta = useCallback(() => {
    if (cta?.url) {
      if (cta.type === 'INTERNAL') {
        try {
          navigateTo(cta.url)
        } catch {
          window.location.href = cta.url
        }
      } else {
        window.location.href = cta.url
      }
    }
    onCtaClick()
  }, [cta, navigateTo, onCtaClick])

  const imageUrl = asset?.assets?.[0]
  const isVideo = asset?.type === 'VIDEO'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent
        borderRadius="16px"
        maxW={{ base: '340px', md: '400px' }}
        my="54px"
        maxH="calc(100dvh - 108px)"
        display="flex"
        flexDirection="column"
        overflow="hidden"
      >
        {/* Fixed close button — stays in place while body scrolls */}
        <ModalCloseButton
          zIndex={10}
          bg="whiteAlpha.800"
          borderRadius="full"
          _hover={{ bg: 'white' }}
        />

        <ModalBody
          p={4}
          flex="1"
          minH={0}
          overflowY="auto"
          overflowX="hidden"
        >
          <VStack align="stretch" spacing={3}>
            {imageUrl && !isVideo && (
              <Image
                src={imageUrl}
                alt={title}
                objectFit="cover"
                w="full"
                h="auto"
                borderRadius="20px"
              />
            )}

            {isVideo && (
              <Box
                as="video"
                src={imageUrl}
                title={title}
                borderRadius="20px"
                autoPlay
                loop
                muted
                playsInline
                w="full"
                h="auto"
              />
            )}

            {title && (
              <Text fontSize="md" fontWeight="700" color="gray.700">
                {title}
              </Text>
            )}

            {description && (
              <Text fontSize="sm" color="gray.700">
                {description}
              </Text>
            )}

            {cta?.title && (
              <Button
                variant="solid-blue"
                width="full"
                size="md"
                onClick={handleCta}
                mt={1}
              >
                {cta.title}
              </Button>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
