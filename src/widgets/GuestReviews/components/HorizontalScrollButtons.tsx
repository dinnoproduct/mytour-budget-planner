import { Flex, IconButton } from "@chakra-ui/react";
import { Icon } from "@ui";

type HorizontalScrollButtonsProps = {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  onScrollLeft: () => void;
  onScrollRight: () => void;
};

export const HorizontalScrollButtons = ({
  canScrollLeft,
  canScrollRight,
  onScrollLeft,
  onScrollRight,
}: HorizontalScrollButtonsProps) => {
  return (
    <Flex gap="2" display={{ base: "none", md: "flex" }}>
      <IconButton
        aria-label="Previous offers"
        icon={
          <Icon
            name="chevron-left"
            color={canScrollLeft ? "blue.500" : "gray.300"}
          />
        }
        size="md"
        bg="white"
        variant="outline"
        borderColor={canScrollLeft ? "blue.500" : "gray.300"}
        isDisabled={!canScrollLeft}
        onClick={onScrollLeft}
      />
      <IconButton
        aria-label="Next offers"
        icon={
          <Icon
            name="chevron-right"
            color={canScrollRight ? "blue.500" : "gray.300"}
          />
        }
        size="md"
        borderColor={canScrollRight ? "blue.500" : "gray.300"}
        variant="outline"
        bg="white"
        isDisabled={!canScrollRight}
        onClick={onScrollRight}
      />
    </Flex>
  );
};

