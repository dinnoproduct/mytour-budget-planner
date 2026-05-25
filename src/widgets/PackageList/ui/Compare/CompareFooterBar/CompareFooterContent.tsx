import { Box, Flex, HStack } from "@chakra-ui/react";
import { Button, Text } from "@ui";
import { SelectedCompareItem } from "../SelectedCompareItem";
import { type CompareFooterContentProps } from "./types";

export const CompareFooterContent = ({
  selectedPackages,
  getCompareKey,
  onRemove,
  onClear,
  onCompare,
  clearLabel,
  compareLabel,
  counterLabel,
  isMobile = false,
  isCompareDisabled = false,
}: CompareFooterContentProps) => {
  return (
    <Box px={{ base: 4, md: 8 }} py={{ base: 3, md: 4 }}>
      {!isMobile && counterLabel ? (
        <Text
          size="sm"
          color="gray.800"
          fontWeight="700"
          whiteSpace="nowrap"
        >
          {counterLabel}
        </Text>
      ) : null}
      <Flex
        align="center"
        justify="space-between"
        gap={4}
        mt={{ base: 0, md: 2 }}
        alignItems={{ base: "stretch", md: "center" }}
        direction={{ base: "column", md: "row" }}
      >
        <Box
          w="full"
          overflowX="auto"
          sx={{
            "&::-webkit-scrollbar": { height: "6px" },
          }}
        >
          <HStack
            spacing={2}
            w={{ base: "max-content", md: "full" }}
            minW={{ base: "max-content", md: "0" }}
            alignItems="stretch"
            pr={{ base: 1, md: 0 }}
          >
            {selectedPackages.map((item) => {
              return (
                <SelectedCompareItem
                  key={getCompareKey(item)}
                  item={item}
                  onRemove={() => onRemove(getCompareKey(item))}
                  clearLabel={clearLabel}
                />
              );
            })}
          </HStack>
        </Box>
        <HStack
          w={{ base: "full", md: "auto" }}
          spacing={2}
        >
          <Button
            variant="outline-blue"
            width={{ base: "full", md: "auto" }}
            onClick={onClear}
          >
            {clearLabel}
          </Button>
          <Button
            variant="solid-blue"
            width={{ base: "full", md: "auto" }}
            onClick={onCompare}
            isDisabled={isCompareDisabled}
          >
            {compareLabel}
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};
