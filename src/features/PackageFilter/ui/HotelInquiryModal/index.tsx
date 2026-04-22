import { useEffect, useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Image,
  VStack,
  Flex,
  Text,
  Box,
  ModalFooter,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Button, Icon } from '@/shared/ui'
import { useUserContext } from '@entities/user'
import { useHotelInquiry } from '@entities/notification'
import { DatePickerFlexibleSearch } from '@features/DatePickerFlexibleSearch'
import { DatePickerFlights } from '@/features/DatePickerFlights'
import { usePackagesSearchContext } from '@entities/package'
import { useSearchParams } from 'react-router-dom'
import {
  formatDate,
  normalizePhone,
  parseQueryDate,
  type TravelersData,
} from './helpers'
import { TravelersSection } from './TravelersSection'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ARMENIA_PHONE_REGEX = /^\+374\d{8}$/
const MAX_FULL_NAME_LENGTH = 40
const MAX_HOTEL_NAME_LENGTH = 60
const MAX_CITY_NAME_LENGTH = 40

const normalizePhoneInput = (value: string) => {
  const digitsOnly = value.replace(/[^\d]/g, '')
  const localPart = digitsOnly.startsWith('374')
    ? digitsOnly.slice(3, 11)
    : digitsOnly.slice(0, 8)
  return `+374${localPart}`
}

type HotelInquiryModalProps = {
  isOpen: boolean
  onClose: () => void
  contentType?: 'hotel' | 'package'
}

export const HotelInquiryModal: React.FC<HotelInquiryModalProps> = ({
  isOpen,
  onClose,
  contentType = 'hotel',
}) => {
  const { t } = useTranslation()
  const { user } = useUserContext()
  const [searchParams] = useSearchParams()
  const isPackage = contentType === 'package'
  const {
    availableDepartureDates,
    availableReturnDates,
    isLoadingReturnDates,
    handleFromDateClick,
  } = usePackagesSearchContext()

  const [fullName, setFullName] = useState(`${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim())
  const [email, setEmail] = useState(user?.email ?? '')
  const [phone, setPhone] = useState(normalizePhone(user?.phoneNumber))
  const [phoneInvalid, setPhoneInvalid] = useState(false)
  const [emailInvalid, setEmailInvalid] = useState(false)
  const [hotelName, setHotelName] = useState('')
  const [cityName, setCityName] = useState('')
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const [toDate, setToDate] = useState<Date | null>(null)
  const [travelersData, setTravelersData] = useState<TravelersData>({
    adultsCount: 2,
    childrenCount: 0,
    childrenAges: [],
  })
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
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
    setHotelName('')
    setCityName('')
    setFromDate(null)
    setToDate(null)
    setTravelersData({
      adultsCount: 2,
      childrenCount: 0,
      childrenAges: [],
    })
    setSubmitError(null)
    setIsSuccess(false)
    setIsError(false)
    setIsDatePickerOpen(false)
  }

  const handleCloseModal = () => {
    resetFormState()
    onClose()
  }

  const { mutate: submitInquiry, isPending } = useHotelInquiry({
    onSuccess: () => {
      setIsSuccess(true)
      setIsError(false)
    },
    onError: () => {
      setIsSuccess(false)
      setIsError(true)
      setSubmitError(t('hotelInquiryModal.ErrorMessage'))
    },
  })

  useEffect(() => {
    if (!user) return
    if (!fullName) setFullName(`${user.firstName ?? ''} ${user.lastName ?? ''}`.trim())
    if (!email) setEmail(user.email ?? '')
    if (phone === '+374') setPhone(normalizePhone(user.phoneNumber))
  }, [user, fullName, email, phone])

  useEffect(() => {
    if (fromDate || toDate) return

    const fromParam = searchParams.get('from') ?? searchParams.get('dateFrom')
    const toParam = searchParams.get('to') ?? searchParams.get('dateTo')
    const queryFromDate = parseQueryDate(fromParam)
    const queryToDate = parseQueryDate(toParam)

    if (queryFromDate) {
      setFromDate(queryFromDate)
    }
    if (queryToDate) {
      setToDate(queryToDate)
    }
  }, [searchParams, fromDate, toDate])

  const onSubmitInquiry = () => {
    const trimmedFullName = fullName.trim()
    const trimmedEmail = email.trim()
    const trimmedHotelName = hotelName.trim()
    const trimmedCityName = cityName.trim()

    if (!trimmedFullName || !trimmedEmail || !trimmedHotelName || !trimmedCityName) {
      setSubmitError(t('requiredField'))
      return
    }

    if (
      trimmedFullName.length > MAX_FULL_NAME_LENGTH ||
      trimmedHotelName.length > MAX_HOTEL_NAME_LENGTH ||
      trimmedCityName.length > MAX_CITY_NAME_LENGTH
    ) {
      setSubmitError(t('invalidFormatErrorMessage'))
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
    setSubmitError(null)
    submitInquiry({
      phone,
      fullName: trimmedFullName,
      email: trimmedEmail,
      hotelName: trimmedHotelName,
      cityName: trimmedCityName,
      dateFrom: fromDate ? formatDate(fromDate) : '',
      dateTo: toDate ? formatDate(toDate) : '',
      adults: travelersData.adultsCount,
      childs: travelersData.childrenAges,
    })
  }

  const isResultScreen = isSuccess || isError
  const isSubmitDisabled =
    !fullName.trim() ||
    !email.match(EMAIL_REGEX) ||
    !phone.match(ARMENIA_PHONE_REGEX) ||
    !hotelName.trim() ||
    !cityName.trim()

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      size={{ base: isResultScreen ? 'sm' : 'full', md: 'md' }}
      isCentered
      scrollBehavior='inside'
    >
      <ModalOverlay />
      <ModalContent
        overflow='hidden'
        rounded={'lg'}
        mx={{ base: isResultScreen ? 4 : 0, md: 0 }}
      >
        {!isSuccess && !isError && (
          <ModalHeader >
            <Text fontSize="lg" fontWeight="semibold" color="gray.800">
              {t('hotelInquiryModal.title')}
            </Text>
            <Text fontSize="sm" fontWeight="normal" color="gray.800">
              {t('hotelInquiryModal.description')}
            </Text>
          </ModalHeader>
        )}
        {!isDatePickerOpen && <ModalCloseButton />}
        {isSuccess ? (
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Image
                src="/assets/illustrations/success.png"
                alt="Success"
                w="160px"
                h="auto"
              />
              <Text
                textAlign="center"
                color="gray.700"
                fontSize="md"
                fontWeight="600"
              >
                {t('hotelInquiryModal.SuccessMessage')}
              </Text>
            </VStack>
          </ModalBody>
        ) : isError ? (
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Image
                src="/assets/illustrations/error.png"
                alt="Error"
                w="160px"
                h="auto"
              />
              <Text
                textAlign="center"
                color="gray.700"
                fontSize="md"
                fontWeight="600"
              >
                {t('hotelInquiryModal.ErrorMessage')}
              </Text>
            </VStack>
          </ModalBody>
        ) : (
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              {!isFullNamePrefilled && (
                <FormControl isRequired>
                  <FormLabel>{t('hotelInquiryModal.fullName')}</FormLabel>
                  <Input
                    value={fullName}
                    maxLength={MAX_FULL_NAME_LENGTH}
                    onChange={(e) => setFullName(e.target.value.slice(0, MAX_FULL_NAME_LENGTH))}
                  />
                </FormControl>
              )}
              {!isEmailPrefilled && (
                <FormControl isRequired isInvalid={emailInvalid}>
                  <FormLabel>{t('hotelInquiryModal.email')}</FormLabel>
                  <Input
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (emailInvalid) setEmailInvalid(false)
                    }}
                  />
                  {emailInvalid ? (
                    <FormErrorMessage>{t('invalidFormatErrorMessage')}</FormErrorMessage>
                  ) : null}
                </FormControl>
              )}
              {!isPhonePrefilled && (
                <FormControl isRequired isInvalid={phoneInvalid}>
                  <FormLabel>{t('hotelInquiryModal.phone')}</FormLabel>
                  <Input
                    type="tel"
                    pattern="^\+374\d{8}$"
                    value={phone}
                    onChange={(e) => {
                      setPhone(normalizePhoneInput(e.target.value))
                      if (phoneInvalid) setPhoneInvalid(false)
                    }}
                  />
                  {phoneInvalid ? (
                    <FormErrorMessage>{t('invalidFormatErrorMessage')}</FormErrorMessage>
                  ) : null}
                </FormControl>
              )}
              <FormControl isRequired>
                <FormLabel >{t('travelDates')}</FormLabel>
                <Box
                  width="full"
                  sx={{
                    "& > span, & > div, & [role='group']": {
                      width: "100% !important",
                      maxWidth: "100% !important",
                    },
                  }}
                >
                  {isPackage ? (
                    <DatePickerFlights
                      fromDate={fromDate}
                      toDate={toDate}
                      portalZIndex={1500}
                      menuProps={{ strategy: 'fixed', placement: user ? 'bottom-start' : 'auto-start' }}
                      onOpenChange={setIsDatePickerOpen}
                      onAccept={(from, to) => {
                        setFromDate(from);
                        setToDate(to ?? null);
                      }}
                      onFromDateClick={handleFromDateClick}
                      availableDepartureDates={availableDepartureDates}
                      availableReturnDates={availableReturnDates}
                      isLoadingReturnDates={isLoadingReturnDates}
                    />
                  ) : (
                    <DatePickerFlexibleSearch
                      fromDate={fromDate}
                      toDate={toDate}
                      portalZIndex={1500}
                      menuProps={{ strategy: 'fixed', placement: 'bottom-start' }}
                      onOpenChange={setIsDatePickerOpen}
                      exactDatesOnly
                      onAccept={(from, to) => {
                        setFromDate(from);
                        setToDate(to ?? null);
                      }}
                    />
                  )}
                </Box>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>{t('hotelInquiryModal.hotelName')}</FormLabel>
                <Input
                  value={hotelName}
                  maxLength={MAX_HOTEL_NAME_LENGTH}
                  onChange={(e) => setHotelName(e.target.value.slice(0, MAX_HOTEL_NAME_LENGTH))}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>{t('hotelInquiryModal.cityName')}</FormLabel>
                <Input
                  value={cityName}
                  maxLength={MAX_CITY_NAME_LENGTH}
                  onChange={(e) => setCityName(e.target.value.slice(0, MAX_CITY_NAME_LENGTH))}
                />
              </FormControl>
              <FormControl>
                <FormLabel>{t('travelers')}</FormLabel>
                <TravelersSection
                  t={t}
                  travelersData={travelersData}
                  setTravelersData={setTravelersData}
                />
              </FormControl>
              {submitError ? (
                <Text color="red.500" fontSize="sm">
                  {submitError}
                </Text>
              ) : null}
            </VStack>
          </ModalBody>
        )}
        {!isSuccess && !isError && (
          <ModalFooter>
            <Button width="full" onClick={onSubmitInquiry} isLoading={isPending} size="lg" isDisabled={isSubmitDisabled}>
              {t('hotelInquiryModal.submit')}
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  )
}


export const HotelInquiryModalTrigger: React.FC<{ onClick: () => void }> = ({
  onClick,
}) => {
  const { t } = useTranslation()

  return (
    <Box
      width="full"
      bgColor="gray.700"
      color="white"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      borderRadius="lg"
      p={4}
      cursor="pointer"
      onClick={onClick}
    >
      <Flex display="flex" alignItems="center" gap={2}>
        <Box
          backgroundColor="green.500"
          borderRadius="full"
          display="flex"
          alignItems="center"
          p={1}
        >
          <Icon name="fluent-alert" size="16" color="white" />
        </Box>
        <Text fontSize="sm" fontWeight="semibold" color="white">
          {t('hotelInquiryModal.title')}
        </Text>
      </Flex>
      <Icon name="chevron-right" size="16" color="white" />
    </Box>
  )
}
