import { Box, Button, Flex } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { IGeneratedMultivendorOffer } from '../../../../modules/packages/data/packagesTypes';
import { numberWithCommaNormalizer } from '@/utils/normalizers';
import { CURRENCY_MAP } from '@/shared/model';
import { formatNumber } from '@/shared/utils';
import { Icon, Text } from '@/shared/ui';
import { useModalContext } from '@/app/providers';
import { useUserContext } from '@/entities/user';
import { useRecoilState } from 'recoil';
import { isBookingFlowOpenAtom } from '@/modules/packages/store/store';

export const Footer: React.FC<{ offer: IGeneratedMultivendorOffer, updateChildrenAges: (childrenAges: number[]) => void, closeBookingDrawer: () => void }> = ({ offer, updateChildrenAges, closeBookingDrawer }) => {
    const { t } = useTranslation();
    const { dispatchModal } = useModalContext()
    const { user } = useUserContext()
    const [isBookingFlowOpen, setBookingFlowOpen] = useRecoilState(isBookingFlowOpenAtom)

    const openAuthModal = () => {
        if (user?.id) {
            setBookingFlowOpen(true)
            closeBookingDrawer()
            return
        }

        dispatchModal({
            type: 'open',
            modalType: 'auth',
            props: {
                view: 'signUp',
                isCloseOnSuccess: true,
                onSuccess: () => {
                    setBookingFlowOpen(true)
                }
            }
        })
    }

    const handleBookClick = ({ childrenAges }: { childrenAges: number[] }) => {
        updateChildrenAges(childrenAges)
        openAuthModal()
    }


    return (
        <Box>
            <Flex width="full" justify="space-between" align="center" height="28px" mb={2}>
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
                                    {CURRENCY_MAP[offer.currency as keyof typeof CURRENCY_MAP]}{' '}
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
                onClick={(e) => {
                    handleBookClick({ childrenAges: [] })
                }}
            >
                {t`reserve`}
            </Button>
        </Box>
    );
};