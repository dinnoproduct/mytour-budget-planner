import { Box, Flex, Img, RadioGroup, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Button, NewBadge, Radio, SoonBadge, Text } from "@ui";
import { StepBottomActions } from "@widgets/BookingFlow/ui/StepBottomActions";
import {
  PaymentMethod,
  type PaymentMethodCardProps,
  type PaymentMethodViewProps,
} from "@widgets/BookingFlow/ui/PaymentModal/types.ts";
import { useRef, useState } from "react";
import { BookingStep, metaEvents } from "@/shared/configs/metaEvents";

export const PaymentMethodView = ({
  onSubmit,
  isLoadingBooking,
  packageDetails,
  onBackClick,
  renderAsPage = false,
}: PaymentMethodViewProps) => {
  const { t } = useTranslation();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
    PaymentMethod.bankCard,
  );
  const selectedMethodRef = useRef(selectedMethod);
  selectedMethodRef.current = selectedMethod;

  const handleMethodChange = (method: PaymentMethod) => {
    setSelectedMethod(method);
  };

  const handleLogEvent = () => {
    if (packageDetails) {
      metaEvents.bookingStepCompleted({
        hotel_id: packageDetails.hotel.id,
        step_number: 3,
        step_name: BookingStep.PaymentMethodSelected,
      });
    }
  };

  const handleContinue = async () => {
    try {
      // Track payment method selection step
      handleLogEvent();
      // Use ref to avoid stale closure when user taps Pay quickly after selecting method
      onSubmit(selectedMethodRef.current);
    } catch (error) {
      console.error("Error submitting payment method:", error);
    }
  };

  return (
    <Flex direction="column" justify="space-between" width="full" {...(renderAsPage ? {} : { height: 'full' })}>
      <Flex
        width="full"
        py="6"
        px="4"
        overflowY={renderAsPage ? { base: "visible", md: "visible" } : { base: "scroll", md: "visible" }}
        {...(renderAsPage ? {} : { maxHeight: { base: "calc(100dvh - 160px)", md: "none" } })}
        direction="column"
        maxWidth="402px"
        mx="auto"
        sx={{
          "&::-webkit-scrollbar": {
            width: "0",
          },
        }}
      >
        <RadioGroup value={selectedMethod} onChange={handleMethodChange}>
          <VStack align="stretch">
            <PaymentMethodCard
              label="bankCard"
              imgSrc="/assets/images/bank-card.svg"
              imgAlt="bank card"
              radioProps={{
                value: PaymentMethod.bankCard,
                onChange: () => handleMethodChange(PaymentMethod.bankCard),
              }}
              isBorder
            />

            <PaymentMethodCard
              label="AmeriaPay"
              imgSrc="/assets/images/ameria-pay.svg"
              imgAlt="ameriaPay"
              radioProps={{
                value: PaymentMethod.ameriaPay,
                onChange: () => handleMethodChange(PaymentMethod.ameriaPay),
              }}
              labelSuffix={<SoonBadge mt="1" />}
              isDisabled
            />

            {/* <PaymentMethodCard
              label="Idram"
              imgSrc="/assets/images/idram.svg"
              imgAlt="idram"
              radioProps={{
                value: PaymentMethod.idram,
                onChange: () => handleMethodChange(PaymentMethod.idram),
              }}
              labelSuffix={<NewBadge mt="1" />}
              isBorder
            /> */}

            <PaymentMethodCard
              label="onlineLoan"
              imgSrc="/assets/images/online-loan.svg"
              imgAlt="online loan"
              labelSuffix={<SoonBadge mt="1" />}
              isDisabled
            />
          </VStack>
        </RadioGroup>
      </Flex>

      {renderAsPage && onBackClick ? (
        <StepBottomActions
          stickyOnMobile
          onBack={onBackClick}
          backLabel={t`back`}
          isLoadingBooking={isLoadingBooking}
          primaryButton={
            <Button
              variant="solid-blue"
              size="lg"
              width="full"
              onClick={handleContinue}
              isLoading={isLoadingBooking}
            >
              {t`pay`}
            </Button>
          }
        />
      ) : (
        <Box
          p="4"
          width="full"
          borderTop="1px solid"
          borderColor="gray.100"
          backgroundColor="white"
          mt="auto"
        >
          <Button
            variant="solid-blue"
            size="lg"
            width="full"
            onClick={handleContinue}
            isLoading={isLoadingBooking}
          >
            {t`pay`}
          </Button>
        </Box>
      )}
    </Flex>
  );
};

const PaymentMethodCard = ({
  label,
  imgSrc,
  imgAlt,
  radioProps,
  isBorder,
  isDisabled,
  labelSuffix,
}: PaymentMethodCardProps) => {
  const { t } = useTranslation();

  const handleCardClick = () => {
    if (!isDisabled && radioProps?.onChange) {
      radioProps.onChange({ target: { value: radioProps.value } } as any);
    }
  };

  return (
    <Flex
      align="center"
      justify="space-between"
      py="3"
      borderBottom={isBorder ? "1px solid" : "none"}
      borderColor="gray.300"
      opacity={isDisabled ? "0.4" : "1"}
      cursor={isDisabled ? "not-allowed" : "pointer"}
      onClick={handleCardClick}
    >
      <Flex align="center">
        <Img src={imgSrc} alt={imgAlt} height="40px" width="40px" />
        <Text size="sm" ml="3" mr={labelSuffix ? "1" : "0"}>
          {t(label)}
        </Text>

        {labelSuffix}
      </Flex>

      <Radio
        cursor={isDisabled ? "not-allowed !important" : "pointer"}
        size="lg"
        {...(radioProps || {})}
      />
    </Flex>
  );
};
