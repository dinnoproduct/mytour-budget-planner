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
import { useRef, useState, useEffect, useCallback } from 'react'
import { Button, Text } from '@ui'
import { type SplashNotification } from '../api/types'
import { useLanguageNavigate } from '@/hooks/useLanguageNavigate'

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
  const descRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)

  useEffect(() => {
    if (!isOpen) setIsExpanded(false)
  }, [isOpen])

  // Only measure when collapsed so the flag is never cleared on expand
  useEffect(() => {
    if (!isOpen || isExpanded) return
    const id = setTimeout(() => {
      const el = descRef.current
      if (!el) return
      setIsOverflowing(el.scrollHeight > el.clientHeight + 1)
    }, 0)
    return () => clearTimeout(id)
  }, [description, isOpen, isExpanded])

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
        <ModalCloseButton
          zIndex={10}
          bg="whiteAlpha.800"
          position="absolute"
          top={6}
          right={6}
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
              <Box
                ref={descRef}
                fontSize="sm"
                color="gray.700"
                sx={
                  !isExpanded
                    ? {
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }
                    : {}
                }
              >
                {description}
              </Box>
            )}

            {isOverflowing && (
              <Box
                as="span"
                fontSize="sm"
                fontWeight="700"
                color="blue.500"
                cursor="pointer"
                onClick={() => setIsExpanded((prev) => !prev)}
              >
                {isExpanded ? 'Close' : 'More'}
              </Box>
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
