import { Flex, IconButton } from "@chakra-ui/react";
import { Icon, Text } from "@ui";
import { type CompareFooterMobileHeaderProps } from "./types";

export const CompareFooterMobileHeader = ({
  counterLabel,
  isExpanded,
  onToggle,
}: CompareFooterMobileHeaderProps) => {
  return (
    <Flex
      display={{ base: "flex", md: "none" }}
      align="center"
      justify="space-between"
      bg="blue.600"
      color="white"
      px={4}
      py={3}
    >
      <Text size="sm" color="white" fontWeight="700" whiteSpace="nowrap">
        {counterLabel}
      </Text>
      <IconButton
        aria-label={isExpanded ? "Collapse compare footer" : "Expand compare footer"}
        variant="ghost"
        minW="28px"
        w="28px"
        h="28px"
        p={0}
        border="1px solid"
        borderColor="whiteAlpha.700"
        color="white"
        _hover={{ bg: "whiteAlpha.200" }}
        _active={{ bg: "whiteAlpha.300" }}
        onClick={onToggle}
        icon={
          <Icon
            name="keyboard-arrow-down"
            size="18"
            color="white"
            style={{
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        }
      />
    </Flex>
  );
};
