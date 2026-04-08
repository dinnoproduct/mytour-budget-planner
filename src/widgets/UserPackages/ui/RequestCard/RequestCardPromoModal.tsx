import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@chakra-ui/react'
import { Button, Text, Input } from '@ui'
import type { TFunction } from 'i18next'
import { useRequestPromoCode } from './useRequestPromoCode'

type Props = {
  showNotPaidButton: boolean
  promo: ReturnType<typeof useRequestPromoCode>
  t: TFunction
}

export const RequestCardPromoModal = ({ showNotPaidButton, promo, t }: Props) => {
  if (!showNotPaidButton) return null

  return (
    <Modal
      isOpen={promo.isPromoModalOpen}
      onClose={promo.handleModalClose}
      isCentered
      size="auth"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text size="lg" fontWeight="medium">{t`usePromoCode`}</Text>
        </ModalHeader>
        <ModalCloseButton color="blue.500"/>
        <ModalBody >
          <Input
            value={promo.promoCode}
            onChange={(e: any) => promo.setPromoCode(e.target.value)}
            state={promo.promoError ? 'invalid' : 'default'}
            placeholder={t`promoCodePlaceholder`}
          />
          {promo.promoError && (
            <Text size="xs" color="red.500" mt={2}>
              {promo.promoError}
            </Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            variant="solid-blue"
            size="md"
            width="full"
            isLoading={promo.isApplying}
            onClick={promo.handleApply}
          >
            {t`apply`}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
