import { Box, Flex, HStack, ListItem, UnorderedList } from "@chakra-ui/react";
import { Button, Text } from "@ui";

type ReviewSummaryProps = {
  totalRate: string;
  reviewsLabel: string;
  rows: { key: string; value: string }[];
  onWriteReview: () => void;
  writeReviewLabel: string;
};

export const ReviewSummary = ({
  totalRate,
  reviewsLabel,
  rows,
  onWriteReview,
  writeReviewLabel,
}: ReviewSummaryProps) => {
  return (
    <Flex direction={{ base: "column", md: "row" }} gap="3" align={{ base: "stretch", md: "start" }}>
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
        <Flex
          bg="gray.50"
          p="4"
          w="full"
          alignItems="center"
          justifyContent="center"
          gap="1.5"
          flexDirection="column"
        >
          <Text size="4xl" fontWeight="bold" color="green.500">
            {totalRate}
          </Text>
          <Text size="sm" color="gray.700">
            {reviewsLabel}
          </Text>
        </Flex>

        <Flex
          bg="white"
          p="3"
          w="full"
          alignItems="center"
          justifyContent="center"
          borderTop="1px solid"
          borderColor="gray.100"
        >
          <Button variant="solid-blue" size="sm" w="full" onClick={onWriteReview}>
            {writeReviewLabel}
          </Button>
        </Flex>
      </Flex>

      <UnorderedList listStyleType="none" mx="0" width="full" spacing="4">
        {rows.map(({ key, value }) => (
          <ListItem key={key} as={HStack} spacing="2" width="full">
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
    </Flex>
  );
};
