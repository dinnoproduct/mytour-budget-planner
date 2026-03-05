import type { ReactNode } from "react";
import { Box, Flex, Grid, Img, Spinner } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Button, Icon, SoonBadge, Text } from "@ui";
import { StepBottomActions } from "@widgets/BookingFlow/ui/StepBottomActions";
import {
  PaymentMethod,
  type PaymentMethodCardProps,
  type PaymentMethodViewProps,
} from "@widgets/BookingFlow/ui/PaymentModal/types.ts";
import { usePaymentSystems } from "@entities/package";
import { BookingStep, metaEvents } from "@/shared/configs/metaEvents";

export const PaymentMethodView = ({
  onSubmit,
  isLoadingBooking,
  packageDetails,
  onBackClick,
  renderAsPage = false,
  selectedMethod,
  onMethodChange,
}: PaymentMethodViewProps) => {
  const { t } = useTranslation();

  const { data: paymentSystems, isLoading: isLoadingSystems } = usePaymentSystems(
    packageDetails?.travelAgency?.id
  );

  // If call finished and no systems returned, go one step back
  if (!isLoadingSystems && (!paymentSystems || paymentSystems.length === 0) && onBackClick) {
    onBackClick();
    return null;
  }

  const handleMethodChange = (method: PaymentMethod | string) => {
    onMethodChange(method);
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
      handleLogEvent();
      onSubmit();
    } catch (error) {
      console.error("Error submitting payment method:", error);
    }
  };

  const paymentMethodCards: Array<{
    label: string;
    imgSrc: string;
    imgAlt: string;
    value: PaymentMethod | string;
    isDisabled: boolean;
    labelSuffix?: ReactNode;
  }> =
    paymentSystems && paymentSystems.length
      ? paymentSystems
          .map((system) => {
            return {
              label: system.name,
              imgSrc: system.iconUrl,
              imgAlt: system.name,
              value: system.paymentSystem,
              isDisabled: isLoadingBooking || isLoadingSystems,
            };
          })
          .filter((card): card is {
            label: string;
            imgSrc: string;
            imgAlt: string;
            value: PaymentMethod | string;
            isDisabled: boolean;
            labelSuffix?: ReactNode;
          } => card !== null)
      : [];

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
        mb={renderAsPage ? {base: '140px', md: 'auto'} : 'auto'}
        sx={{
          "&::-webkit-scrollbar": {
            width: "0",
          },
        }}
      >
        {isLoadingSystems ? (
          <Flex justify="center" align="center" py={8}>
            <Spinner color="blue.500" />
          </Flex>
        ) : (
          <Grid alignItems="stretch" gap={'0.75rem'} templateColumns={'repeat(2, 1fr)'}>
            {paymentMethodCards.map((card) => (
              <PaymentMethodCard
                key={card.value}
                label={card.label}
                imgSrc={card.imgSrc}
                imgAlt={card.imgAlt}
                onChange={() => handleMethodChange(card.value)}
                radioProps={{ value: card.value }}
                isActive={selectedMethod === card.value}
                isDisabled={card.isDisabled}
                labelSuffix={card?.labelSuffix}
              />
            ))}
          </Grid>
        )}
      </Flex>

      {renderAsPage && onBackClick ? (
        <StepBottomActions
          stickyOnMobile
          onBack={onBackClick}
          backLabel={t`back`}
          isDisabled={isLoadingBooking}
          primaryButton={
            <Button
              variant="solid-blue"
              size="lg"
              width="full"
              isDisabled={isLoadingBooking}
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
      transition={'0.2s'}
    >
      <Box 
        position={'absolute'}
        top={'8px'}
        right={'8px'}
        transform={isActive ? 'scale(1)' : 'scale(0)'}
        transition={'.2s'}
      >
        <Icon name="checkmark-circle" size={'20'} color={'blue.500'} />
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
        <Text size="sm" >
          {t(label)}
        </Text>
      </Flex>
    </Flex>
  );
};
