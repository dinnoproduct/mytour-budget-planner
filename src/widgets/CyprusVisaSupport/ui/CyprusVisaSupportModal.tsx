'use client'

import { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormErrorMessage,
  FormLabel,
  VStack,
  Image,
  Text,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Button, Input } from '@ui'
import { useCyprusPackagesSearchContext } from '@entities/package'
import { useUserContext } from '@entities/user'
import { useCreateVisaRequest } from '@entities/visa'
import { buildCreateVisaRequestPayload } from '../lib/buildCreateVisaRequestPayload'
import {
  ARMENIA_PHONE_REGEX,
  EMAIL_REGEX,
  normalizePhone,
  normalizePhoneInput,
} from './helpers'

const MAX_FULL_NAME_LENGTH = 80

type CyprusVisaSupportModalProps = {
  isOpen: boolean
  onClose: () => void
}

export const CyprusVisaSupportModal = ({
  isOpen,
  onClose,
}: CyprusVisaSupportModalProps) => {
  const { t } = useTranslation()
  const { user, userToken } = useUserContext()
  const { searchData, cities } = useCyprusPackagesSearchContext()
  const [fullName, setFullName] = useState(
    `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
  )
  const [email, setEmail] = useState(user?.email ?? '')
  const [phone, setPhone] = useState(normalizePhone(user?.phoneNumber))
  const [phoneInvalid, setPhoneInvalid] = useState(false)
  const [emailInvalid, setEmailInvalid] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)

  const isFullNamePrefilled = Boolean(
    `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
  )
  const isEmailPrefilled = Boolean(user?.email)
  const isPhonePrefilled = Boolean(normalizePhone(user?.phoneNumber) !== '+374')

  const resetFormState = () => {
    setFullName(`${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim())
    setEmail(user?.email ?? '')
    setPhone(normalizePhone(user?.phoneNumber))
    setPhoneInvalid(false)
    setEmailInvalid(false)
    setIsSuccess(false)
    setIsError(false)
  }

  const handleCloseModal = () => {
    resetFormState()
    onClose()
  }

  const { mutate: submitVisaRequest, isPending } = useCreateVisaRequest({
    onSuccess: () => {
      setIsError(false)
      setIsSuccess(true)
    },
    onError: () => {
      setIsSuccess(false)
      setIsError(true)
    },
  })

  const onSubmit = () => {
    const trimmedFullName = fullName.trim()
    const trimmedEmail = email.trim()

    if (!trimmedFullName) {
      return
    }

    if (!trimmedEmail.match(EMAIL_REGEX)) {
      setEmailInvalid(true)
      return
    }

    if (!phone.match(ARMENIA_PHONE_REGEX)) {
      setPhoneInvalid(true)
      return
    }

    setEmailInvalid(false)
    setPhoneInvalid(false)
    setIsSuccess(false)
    setIsError(false)

    if (!userToken) {
      setIsError(true)
      return
    }

    submitVisaRequest({
      token: userToken,
      payload: buildCreateVisaRequestPayload(searchData, cities),
    })
  }

  const isResultScreen = isSuccess || isError
  const isSubmitDisabled =
    !fullName.trim() ||
    !email.match(EMAIL_REGEX) ||
    !phone.match(ARMENIA_PHONE_REGEX)

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      size={{ base: isResultScreen ? 'sm' : 'full', md: 'md' }}
      isCentered
      scrollBehavior="inside"
      autoFocus={false}
    >
      <ModalOverlay />
      <ModalContent
        overflow="hidden"
        rounded="lg"
        mx={{ base: isResultScreen ? 4 : 0, md: 0 }}
      >
        {!isSuccess && !isError && (
          <ModalHeader>
            <Text fontSize="lg" fontWeight="semibold" color="gray.800">
              {t('cyprusVisa.modal.title')}
            </Text>
            <Text fontSize="sm" fontWeight="normal" color="gray.600" mt={1}>
              {t('cyprusVisa.modal.description')}
            </Text>
          </ModalHeader>
        )}
        <ModalCloseButton />
        {isSuccess ? (
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Image
                src="/assets/illustrations/success.png"
                alt=""
                w="160px"
                h="auto"
              />
              <Text
                textAlign="center"
                color="gray.700"
                fontSize="md"
                fontWeight="600"
              >
                {t('cyprusVisa.modal.success')}
              </Text>
            </VStack>
          </ModalBody>
        ) : isError ? (
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Image
                src="/assets/illustrations/error.png"
                alt=""
                w="160px"
                h="auto"
              />
              <Text
                textAlign="center"
                color="gray.700"
                fontSize="md"
                fontWeight="600"
              >
                {t('cyprusVisa.modal.error')}
              </Text>
            </VStack>
          </ModalBody>
        ) : (
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              {!isFullNamePrefilled && (
                <FormControl isRequired>
                  <FormLabel>{t('cyprusVisa.modal.fullName')}</FormLabel>
                  <Input
                    value={fullName}
                    maxLength={MAX_FULL_NAME_LENGTH}
                    onChange={(e) =>
                      setFullName(
                        e.target.value
                          .replace(/^\s+/, '')
                          .slice(0, MAX_FULL_NAME_LENGTH),
                      )
                    }
                  />
                </FormControl>
              )}
              {!isEmailPrefilled && (
                <FormControl isRequired isInvalid={emailInvalid}>
                  <FormLabel>{t('cyprusVisa.modal.email')}</FormLabel>
                  <Input
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value.replace(/^\s+/, ''))
                      if (emailInvalid) {
                        setEmailInvalid(false)
                      }
                    }}
                  />
                  {emailInvalid ? (
                    <FormErrorMessage>
                      {t('invalidFormatErrorMessage')}
                    </FormErrorMessage>
                  ) : null}
                </FormControl>
              )}
              {!isPhonePrefilled && (
                <FormControl isRequired isInvalid={phoneInvalid}>
                  <FormLabel>{t('cyprusVisa.modal.phone')}</FormLabel>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(normalizePhoneInput(e.target.value))
                      if (phoneInvalid) {
                        setPhoneInvalid(false)
                      }
                    }}
                  />
                  {phoneInvalid ? (
                    <FormErrorMessage>
                      {t('invalidFormatErrorMessage')}
                    </FormErrorMessage>
                  ) : null}
                </FormControl>
              )}
            </VStack>
          </ModalBody>
        )}
        {!isSuccess && !isError && (
          <ModalFooter>
            <Button
              width="full"
              onClick={onSubmit}
              isLoading={isPending}
              size="lg"
              isDisabled={isSubmitDisabled}
            >
              {t('cyprusVisa.modal.submit')}
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  )
}
