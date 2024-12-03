import { useRef } from 'react'
import { type LayoutProps } from './types.ts'
import {
  Flex,
  Modal as ChakraModal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react'
import { Button, Text } from '@ui'

export const Layout = ({
  children,
  isOpen,
  closeModal,
  title,
  onBackClick
}: LayoutProps) => {
  const modalContentRef = useRef<HTMLDivElement>(null)

  return (
    <ChakraModal
      isOpen={isOpen}
      onClose={closeModal}
      isCentered
      size="payment"
      initialFocusRef={modalContentRef}
    >
      <ModalOverlay />

      <ModalContent ref={modalContentRef}>
        <ModalHeader p="4" borderBottom="1px solid" borderColor="gray.100">
          <Flex width="full" justify="space-between" align="center">
            <Flex align="center">
              {onBackClick ? (
                <Button
                  icon="arrow-back"
                  variant="text-blue"
                  size="lg"
                  onClick={onBackClick}
                />
              ) : null}
              <Text size="lg" fontWeight="medium">
                {title}
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

        <ModalBody p="0">
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
