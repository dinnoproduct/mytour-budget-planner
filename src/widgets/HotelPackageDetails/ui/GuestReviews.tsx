import { Box, Flex, HStack, ListItem, UnorderedList } from "@chakra-ui/react";
import { Button, Text } from "@ui";
import { useTranslation } from "react-i18next";
import { useUserContext } from "@entities/user";
import { SectionLayout } from "./SectionLayout.tsx";

type GuestReviewsProps = {
    travellersRating?: number;
    cleanliness?: number;
};

const formatRate = (value?: number) => {
    if (typeof value !== "number" || Number.isNaN(value)) {
        return "-";
    }

    return value.toFixed(1);
};

export const GuestReviews = ({
    travellersRating,
    cleanliness,
}: GuestReviewsProps) => {
    const { t } = useTranslation();
    const { user } = useUserContext();

    const ratingRows = [
        { key: t`guestsReviews`, value: formatRate(travellersRating) },
        { key: t`cleanliness`, value: formatRate(cleanliness) },
    ];

    return (
        <Flex
            direction={{ base: "column", md: "row" }}
            gap="3"
            align={{ base: "stretch", md: "start" }}
        >
            <Flex
                minW={{ base: "full", md: "230px" }}
                borderRadius="lg"
                textAlign="center"
                alignItems="center"
                overflow="hidden"
                border="1px solid"
                borderColor="gray.100"
                flexDirection="column"
            >
                <Flex bg="gray.50" p="4" w="full" alignItems="center" justifyContent="center" gap="1.5" flexDirection="column">
                    <Text size="4xl" fontWeight="bold" color="green.500">
                        {formatRate(((travellersRating ?? 0) + (cleanliness ?? 0)) / 2)}
                    </Text>
                    <Text size="sm" color="gray.700">
                        {t('reviews', { count: Math.floor(Math.random() * 100) })}
                    </Text>
                </Flex>
                {
                    user && (
                        <Flex bg="white" p="3" w="full" alignItems="center" justifyContent="center" borderTop="1px solid" borderColor="gray.100">
                            <Button
                                variant="solid-blue"
                                size="sm"
                                w="full"
                                onClick={() => { }}
                            >
                                {t('writeReview')}
                            </Button>
                        </Flex>
                    )}
            </Flex>

            <UnorderedList
                listStyleType="none"
                mx="0"
                width="full"
                spacing="4"
            >
                {ratingRows.map(({ key, value }) => (
                    <ListItem key={key as any} as={HStack} spacing="2" width="full">
                        <Text fontWeight="normal" size="sm" flexShrink={0}>
                            {key}
                        </Text>

                        <Box
                            backgroundImage="/assets/images/border.svg"
                            height="2px"
                            width="full"
                            backgroundRepeat="repeat-x"
                            borderRadius="full"
                            mt="0.5"
                        />

                        <Text fontWeight="semibold" size="sm" flexShrink={0}>
                            {value}
                        </Text>
                    </ListItem>
                ))}
            </UnorderedList>
        </Flex >
    );
};
