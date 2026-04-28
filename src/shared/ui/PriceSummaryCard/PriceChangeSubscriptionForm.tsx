import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DatePickerFlexibleSearch } from "@features/DatePickerFlexibleSearch";
import { DatePickerFlights } from "@features/DatePickerFlights";
import { usePackagesSearchContext } from "@entities/package";
import { usePriceAlertSubscribe } from "@entities/notification";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ARMENIA_PHONE_REGEX = /^\+374\d{8}$/;

export type PriceAlertSubscriptionData = {
  initialPrice?: number;
  hotelUrl?: string;
  hotelId?: string;
  cities?: number[];
  adults?: number;
  childs?: number[];
};

type PriceChangeSubscriptionFormProps = {
  initialFullName?: string;
  initialEmail?: string;
  initialPhone?: string;
  contentType?: "hotel" | "package";
  initialFromDate?: Date | null;
  initialToDate?: Date | null;
  subscriptionData?: PriceAlertSubscriptionData;
  onSuccess?: () => void;
};

const normalizePhone = (value?: string) => {
  if (!value) return "+374";
  const sanitized = value.replace(/\s+/g, "");
  if (sanitized.startsWith("+374")) {
    return sanitized.slice(0, 12);
  }
  return `+374${sanitized.replace(/^\+/, "").slice(0, 8)}`;
};

const normalizePhoneInput = (value: string) => {
  const digitsOnly = value.replace(/[^\d]/g, "");
  const localPart = digitsOnly.startsWith("374")
    ? digitsOnly.slice(3, 11)
    : digitsOnly.slice(0, 8);
  return `+374${localPart}`;
};

const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const PriceChangeSubscriptionForm = ({
  initialFullName,
  initialEmail,
  initialPhone,
  contentType = "hotel",
  initialFromDate,
  initialToDate,
  subscriptionData,
  onSuccess,
}: PriceChangeSubscriptionFormProps) => {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState(initialFullName ?? "");
  const [email, setEmail] = useState(initialEmail ?? "");
  const [phone, setPhone] = useState(normalizePhone(initialPhone));

  const isNameLocked = Boolean(initialFullName);
  const isEmailLocked = Boolean(initialEmail);
  const isPhoneLocked = Boolean(initialPhone);
  const [phoneInvalid, setPhoneInvalid] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [fromDate, setFromDate] = useState<Date | null>(
    initialFromDate ?? null,
  );
  const [toDate, setToDate] = useState<Date | null>(initialToDate ?? null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessageKey, setErrorMessageKey] = useState(
    "priceSummaryCard.ErrorMessage",
  );

  const isPackage = contentType === "package";
  const {
    availableDepartureDates,
    availableReturnDates,
    isLoadingReturnDates,
    handleFromDateClick,
  } = usePackagesSearchContext();

  const { mutate: subscribe, isPending } = usePriceAlertSubscribe({
    onSuccess: () => {
      setIsSuccess(true);
    },
    onError: (error) => {
      const status = (error as { response?: { status?: number } })?.response
        ?.status;
      setErrorMessageKey(
        status === 409
          ? "priceSummaryCard.duplicatedErrorMessage"
          : "priceSummaryCard.ErrorMessage",
      );
      setIsError(true);
    },
  });

  useEffect(() => {
    if (!initialFullName || fullName) return;
    setFullName(initialFullName);
  }, [initialFullName, fullName]);

  useEffect(() => {
    if (!initialEmail || email) return;
    setEmail(initialEmail);
  }, [initialEmail, email]);

  useEffect(() => {
    if (!initialPhone || phone !== "+374") return;
    setPhone(normalizePhone(initialPhone));
  }, [initialPhone, phone]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedFullName) {
      return;
    }

    if (!trimmedEmail.match(EMAIL_REGEX)) {
      setEmailInvalid(true);
      return;
    }

    if (!phone.match(ARMENIA_PHONE_REGEX)) {
      setPhoneInvalid(true);
      return;
    }
    setEmailInvalid(false);
    setPhoneInvalid(false);
    setIsError(false);
    setErrorMessageKey("priceSummaryCard.ErrorMessage");

    subscribe({
      hotelUrl: subscriptionData?.hotelUrl ?? window.location.href,
      fullName: trimmedFullName,
      email: trimmedEmail,
      phoneNumber: phone,
      cities: subscriptionData?.cities ?? [],
      adults: subscriptionData?.adults ?? 1,
      childs: subscriptionData?.childs ?? [],
      dateFrom: fromDate ? formatDate(fromDate) : "",
      dateTo: toDate ? formatDate(toDate) : "",
      hotelId: subscriptionData?.hotelId ?? "",
      initialPrice: subscriptionData?.initialPrice ?? 0,
    });
  };

  if (isSuccess) {
    return (
      <Box
        bg="white"
        rounded={{ base: "none", md: "2xl" }}
        overflow="hidden"
        px={{ base: 4, md: 6 }}
        py={{ base: 8, md: 10 }}
      >
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
            fontSize="sm"
            fontWeight="600"
          >
            {t("priceSummaryCard.SuccessMessage")}
          </Text>
        </VStack>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box
        bg="white"
        rounded={{ base: "none", md: "2xl" }}
        overflow="hidden"
        px={{ base: 4, md: 6 }}
        py={{ base: 8, md: 10 }}
      >
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
            fontSize="sm"
            fontWeight="600"
          >
            {t(errorMessageKey)}
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box bg="white" rounded={{ base: "none", md: "2xl" }} overflow="hidden">
      <Box px={{ base: 4, md: 6 }} py={{ base: 5, md: 6 }}>
        <form onSubmit={handleSubmit} noValidate>
          <VStack align="stretch" spacing={4}>
          <FormControl isRequired>
            <FormLabel color="gray.700" fontSize="sm" mb={2}>
              {t("priceSummaryCard.fullName")}
            </FormLabel>
            <Input
              value={fullName}
                onChange={(e) => setFullName(e.target.value.replace(/^\s+/, ""))}
              placeholder={t("priceSummaryCard.fullNamePlaceholder")}
              isDisabled={isNameLocked}
            />
          </FormControl>

          <FormControl isRequired isInvalid={emailInvalid}>
            <FormLabel color="gray.700" fontSize="sm" mb={2}>
              {t("priceSummaryCard.email")}
            </FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value.replace(/^\s+/, ""));
                if (emailInvalid) setEmailInvalid(false);
              }}
              placeholder={t("priceSummaryCard.emailPlaceholder")}
              isDisabled={isEmailLocked}
            />
            {emailInvalid ? (
              <FormErrorMessage>{t("invalidFormatErrorMessage")}</FormErrorMessage>
            ) : null}
          </FormControl>

          <FormControl isRequired isInvalid={phoneInvalid}>
            <FormLabel color="gray.700" fontSize="sm" mb={2}>
              {t("priceSummaryCard.phone")}
            </FormLabel>
            <Input
              type="tel"
              pattern="^\+374\d{8}$"
              value={phone}
              onChange={(e) => {
                setPhone(normalizePhoneInput(e.target.value));
                if (phoneInvalid) setPhoneInvalid(false);
              }}
              placeholder={t("priceSummaryCard.phonePlaceholder")}
              isDisabled={isPhoneLocked}
            />
            {phoneInvalid ? (
              <FormErrorMessage>{t("invalidFormatErrorMessage")}</FormErrorMessage>
            ) : null}
          </FormControl>

          <FormControl>
            <FormLabel color="gray.700" fontSize="sm" mb={2}>
              {t("priceSummaryCard.travelDates")}
            </FormLabel>
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
                  exactDatesOnly
                  onAccept={(from, to) => {
                    setFromDate(from);
                    setToDate(to ?? null);
                  }}
                />
              )}
            </Box>
          </FormControl>

          <Button
            type="submit"
            variant="solid-blue"
            mt={1}
            width="full"
            size="lg"
            isLoading={isPending}
            isDisabled={!fullName.trim() || !email.match(EMAIL_REGEX) || !phone.match(ARMENIA_PHONE_REGEX)}
          >
            {!isPending && t("priceSummaryCard.subscribeButton")}
          </Button>

          <Text textAlign="center" color="gray.500" fontSize="xs">
            {t("priceSummaryCard.subscribeDisclaimer")}
          </Text>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};
