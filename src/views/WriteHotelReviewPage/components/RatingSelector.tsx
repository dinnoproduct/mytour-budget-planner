import { Flex } from "@chakra-ui/react";
import { Button, Text } from "@ui";

type RatingSelectorProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  isDisabled?: boolean;
};

export const RatingSelector = ({ label, value, onChange, isDisabled }: RatingSelectorProps) => (
  <Flex direction="column" gap="2">
    <Flex justify="space-between" align="center">
      <Text fontWeight="600">{label}</Text>
      <Text fontWeight="600">{value > 0 ? `${value}/10` : "-"}</Text>
    </Flex>
    <Flex gap="1" flexWrap="nowrap" width="100%">
      {Array.from({ length: 10 }, (_, index) => {
        const score = index + 1;
        const isSelected = score === value;
        return (
          <Button
            key={score}
            size="sm"
            flex="1"
            minW="0"
            h="36px"
            px="0"
            bg={isSelected ? "blue.500" : "white"}
            color={isSelected ? "white" : "gray.800"}
            border="1px solid"
            borderColor={isSelected ? "blue.500" : "gray.300"}
            _hover={{
              bg: isSelected ? "blue.600" : "gray.50",
            }}
            _active={{
              bg: isSelected ? "blue.700" : "gray.100",
            }}
            isDisabled={isDisabled}
            onClick={() => onChange(score)}
          >
            {score}
          </Button>
        );
      })}
    </Flex>
  </Flex>
);
