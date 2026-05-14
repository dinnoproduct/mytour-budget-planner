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
        mt={{ base: 0, md: isMobile ? 0 : 2 }}
        alignItems={{ base: "stretch", md: "center" }}
        direction={{ base: "column", md: isMobile ? "column" : "row" }}
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
            w={isMobile ? "max-content" : { base: "max-content", md: "full" }}
            minW={isMobile ? "max-content" : { base: "max-content", md: "0" }}
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
          w={isMobile ? "full" : { base: "full", md: "auto" }}
          spacing={2}
        >
          <Button
            variant="outline-blue"
            width={isMobile ? "full" : { base: "full", md: "auto" }}
            onClick={onClear}
          >
            {clearLabel}
          </Button>
          <Button
            variant="solid-blue"
            width={isMobile ? "full" : { base: "full", md: "auto" }}
            onClick={onCompare}
          >
            {compareLabel}
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};
