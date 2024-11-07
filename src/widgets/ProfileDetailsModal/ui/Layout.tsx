import { useRef } from 'react'
import { type LayoutProps } from './types'
import {
  Flex,
  Modal as ChakraModal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react'
import { Button, Text } from '@ui'
import { useTranslation } from 'react-i18next'

export const Layout = ({ children, isOpen, closeModal }: LayoutProps) => {
  const modalContentRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  return (
    <ChakraModal
      isOpen={isOpen}
      onClose={closeModal}
      isCentered
      size="auth"
      initialFocusRef={modalContentRef}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />

      <ModalContent ref={modalContentRef}>
        <ModalHeader p="4" borderBottom="1px solid" borderColor="gray.100">
          <Flex width="full" justify="space-between" align="center">
            <Flex align="center">
              <Text size="lg" fontWeight="medium">
                {t`personalInformation`}
              </Text>
            </Flex>

            <Button
              variant="text-blue"
              size="lg"
              icon="close"
              onClick={closeModal}
            />
          </Flex>
        </ModalHeader>

        <ModalBody p="0" height="full">
          <Flex
            width="full"
            display="flex"
            flexDirection="column"
            alignItems="center"
            mx="auto"
            height="full"
          >
            {children}
          </Flex>
        </ModalBody>
      </ModalContent>
    </ChakraModal>
  )
}
