import {
  Icon,
  Text,
} from "@ui";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { PriceChangeSubscriptionForm, type PriceAlertSubscriptionData } from "./PriceChangeSubscriptionForm";

type SubscribeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialFullName?: string;
  initialEmail?: string;
  initialPhone?: string;
  contentType?: "hotel" | "package";
  initialFromDate?: Date | null;
  initialToDate?: Date | null;
  subscriptionData?: PriceAlertSubscriptionData;
};

export const SubscribeModal = ({
  isOpen,
  onClose,
  initialFullName,
  initialEmail,
  initialPhone,
  contentType = "hotel",
  initialFromDate,
  initialToDate,
  subscriptionData,
}: SubscribeModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered autoFocus={false} size={{ base: "full", md: "md" }}>
      <ModalOverlay />
      <ModalContent mx={{ base: 0, md: 4 }} sx={{ borderRadius: "2xl" }}>
        <ModalHeader
          bgColor="blue.500"
          p={4}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text size="lg" fontWeight="bold" color="white" textAlign="left" fontSize="md">
            {t("priceSummaryCard.subscribeModalTitle")}
          </Text>
          <Icon name="close" size="24" color="white" cursor="pointer" onClick={onClose} />
        </ModalHeader>
        <ModalBody p={0}>
          <PriceChangeSubscriptionForm
            initialFullName={initialFullName}
            initialEmail={initialEmail}
            initialPhone={initialPhone}
            contentType={contentType}
            initialFromDate={initialFromDate}
            initialToDate={initialToDate}
            subscriptionData={subscriptionData}
            onSuccess={onClose}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
