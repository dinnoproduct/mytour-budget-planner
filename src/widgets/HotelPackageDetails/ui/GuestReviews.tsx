import { Box, Flex } from "@chakra-ui/react";
import { Text } from "@ui";
import { useTranslation } from "react-i18next";
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

    const ratingRows = [
        { key: t`guestsReviews`, value: formatRate(travellersRating) },
        { key: t`cleanliness`, value: formatRate(cleanliness) },
    ];

    return (
        <Flex
            direction={{ base: "column", md: "row" }}
            mt="4"
            gap="3"
            align={{ base: "stretch", md: "start" }}
        >
            <Box
                minW={{ base: "full", md: "190px" }}
                bg="gray.100"
                borderRadius="lg"
                py="4"
                px="5"
                textAlign="center"
            >
                <Text size="4xl" fontWeight="bold" color="green.500">
                    {formatRate(((travellersRating ?? 0) + (cleanliness ?? 0)) / 2)}
                </Text>
            </Box>

            <SectionLayout flex={1} listItems={ratingRows} />
        </Flex>
    );
};
