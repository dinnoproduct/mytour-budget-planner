import { Box, Flex, Grid, Img, RadioGroup, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Button, Checkbox, Icon, NewBadge, Radio, SoonBadge, Text } from "@ui";
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
        py={renderAsPage ? "0" : "6"}
        px={renderAsPage ? "0" : "4"}
        overflowY={renderAsPage ? { base: "visible", md: "visible" } : { base: "scroll", md: "visible" }}
        {...(renderAsPage ? {} : { maxHeight: { base: "calc(100dvh - 160px)", md: "none" } })}
        direction="column"
        maxWidth={renderAsPage ? "full" : "402px"}
        mx="auto"
        sx={{
          "&::-webkit-scrollbar": {
            width: "0",
          },
        }}
      >
          <Grid alignItems="stretch" gap={'0.75rem'} templateColumns={'repeat(2, 1fr)'}>
            <PaymentMethodCard
              label="bankCard"
              imgSrc="/assets/images/bank-card.svg"
              imgAlt="bank card"
              onChange={() => handleMethodChange(PaymentMethod.bankCard)}
              isBorder
              radioProps={{
                value: PaymentMethod.bankCard,
              }}
              isActive={selectedMethod === PaymentMethod.bankCard}
            />

            <PaymentMethodCard
              label="AmeriaPay"
              imgSrc="/assets/images/ameria-pay.svg"
              imgAlt="ameriaPay"
              radioProps={{
                value: PaymentMethod.ameriaPay,
              }}
              isActive={selectedMethod === PaymentMethod.ameriaPay}
              // onChange={() => handleMethodChange(PaymentMethod.ameriaPay)}
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
          </Grid>
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
  isActive,
  onChange,
}: PaymentMethodCardProps) => {
  const { t } = useTranslation();

  const handleCardClick = () => {
    if (!isDisabled && onChange && radioProps?.value !== undefined) {
      onChange({ target: { value: radioProps.value } } as any);
    }
  };

  return (
    <Flex
      align="center"
      justify="center"
      py="5"
      position={'relative'}
      border={"1px solid"}
      borderRadius={'12px'}
      borderColor={isActive ? "blue.500" : "gray.200"}
      opacity={isDisabled ? "0.4" : "1"}
      cursor={isDisabled ? "not-allowed" : "pointer"}
      onClick={handleCardClick}
      transition={'all 0.2s ease-in-out'}
    >
      <Box 
        position={'absolute'}
        top={'8px'}
        right={'8px'}
        transform={isActive ? 'scale(1)' : 'scale(0)'}
        transition={'transform 0.2s ease-in-out'}
      >
        <Icon name="check" size={'20'} color={'blue.500'} />
      </Box>
      <Box 
        position={'absolute'}
        top={'8px'}
        left={'8px'}
      >
        {labelSuffix}
      </Box>

      <Flex align="center" flexDirection={'column'} gap={2}>
        <Img src={imgSrc} alt={imgAlt} height="40px" width="40px" />
        <Text size="sm" ml="3" mr={labelSuffix ? "1" : "0"}>
          {t(label)}
        </Text>

        
      </Flex>
      {/* <Radio
        cursor={isDisabled ? "not-allowed !important" : "pointer"}
        size="lg"
        {...(radioProps || {})}
      /> */}
    </Flex>
  );
};
