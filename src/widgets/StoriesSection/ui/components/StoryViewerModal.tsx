import {
  Box,
  Flex,
  IconButton,
  Modal,
  ModalContent,
  ModalOverlay,
  Spinner
} from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import React, { useEffect, useState } from 'react'

interface StoryViewerModalProps {
  isOpen: boolean
  onClose: () => void
  url: string | null
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  isOpen,
  onClose,
  url
}) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    if (url) {
      setIsLoading(true)
    }
  }, [url])

  const handleIframeLoad = () => {
    setTimeout(() => {
      setIsLoading(false)
    }, 300)
  }

  if (!url) {
    return null
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      closeOnOverlayClick={false}
      closeOnEsc={true}
      isCentered={false}
    >
      <ModalOverlay bg="black" />
      <ModalContent
        maxW="100vw"
        maxH="100vh"
        width="100vw"
        height="100vh"
        m={0}
        borderRadius={0}
        bg="black"
        position="relative"
        sx={{
          backgroundColor: 'black !important'
        }}
      >
        <IconButton
          aria-label="Close story viewer"
          icon={<CloseIcon />}
          position="absolute"
          top={{ base: 4, md: 6 }}
          right={{ base: 4, md: 6 }}
          zIndex={10000}
          onClick={onClose}
          bg="transparent"
          color="white"
          size="md"
          _hover={{ bg: 'transparent', opacity: 0.7 }}
        />

        {isLoading && (
          <Flex
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            align="center"
            justify="center"
            bg="black"
            zIndex={9999}
          >
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="white"
              size="xl"
            />
          </Flex>
        )}

        <Box
          width="100%"
          height="100%"
          as="iframe"
          src={url}
          border="none"
          allowFullScreen
          title="Story Viewer"
          onLoad={handleIframeLoad}
          opacity={isLoading ? 0 : 1}
          transition="opacity 0.3s ease-in-out"
          bg="black"
          sx={{
            backgroundColor: 'black'
          }}
        />
      </ModalContent>
    </Modal>
  )
}

