import { Box, Button, Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { IGeneratedMultivendorOffer } from "@/modules/packages/data/packagesTypes";
import { numberWithCommaNormalizer } from "@/utils/normalizers";
import { CURRENCY_MAP } from "@/shared/model";
import { formatNumber } from "@/shared/utils";
import { Icon, Text } from "@/shared/ui";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { bookingContextAtom } from "@/modules/packages/store/store";
import { useBookingDrawer } from "@/modules/packages/hooks/useBookingDrawer";
import { useLanguageNavigate } from "@/hooks/useLanguageNavigate";
import { useState } from "react";

export const Footer: React.FC<{
  offer: IGeneratedMultivendorOffer;
  closeBookingDrawer: () => void;
  updateSelectedRoomPackage: (offer: IGeneratedMultivendorOffer) => void;
}> = ({ offer, closeBookingDrawer, updateSelectedRoomPackage }) => {
  const { t } = useTranslation();
  const setBookingContext = useSetRecoilState(bookingContextAtom);
  const bookingContext = useRecoilValue(bookingContextAtom);
  const { selectedPackage, updateSelectedRoomPackage: fetchSelectedPackage } =
    useBookingDrawer();
  const { navigateToBooking } = useLanguageNavigate();
  const [bookingInfoProgress, setBookingInfoProgress] = useState<boolean>(false);

  const openBookingPage = () => {
    const context = bookingContext ?? {
      packageDetails: null,
      childrenAges: [] as number[],
      initialView: 'travelers' as const,
    };
    setBookingContext({
      ...context,
      packageDetails: selectedPackage,
    });
    setBookingInfoProgress(true);
    closeBookingDrawer();
    navigateToBooking();
  };

  const handleBookClick = async (offer: IGeneratedMultivendorOffer) => {
    setBookingInfoProgress(true);
    await fetchSelectedPackage(offer);
    openBookingPage();

  };

  return (
    <Box>
      <Flex
        width="full"
        justify="space-between"
        align="center"
        height="28px"
        mb={2}
      >
        <Text textStyle="xs">{t`total`}</Text>

        <Flex>
          <Text size="lg" fontWeight="bold" ml="2">
            {numberWithCommaNormalizer(offer?.price)} ֏
          </Text>
          <Flex align="center">
            {offer ? (
              <>
                <Icon name="approximate" size="20" color="gray.500" />

                <Text size="sm" color="gray.500" ml="0.5">
                  {CURRENCY_MAP[offer.currency as keyof typeof CURRENCY_MAP]}{" "}
                  {formatNumber(offer.priceInCurrency)}
                </Text>
              </>
            ) : null}
          </Flex>
        </Flex>
      </Flex>

      <Button
        width="full"
        colorScheme="blue"
        size="md"
        borderRadius="md"
        isLoading={bookingInfoProgress}
        isDisabled={bookingInfoProgress}
        isActive={!bookingInfoProgress}
        onClick={(e) => {
          handleBookClick(offer);
        }}
      >
        {t`reserve`}
      </Button>
    </Box>
  );
};
