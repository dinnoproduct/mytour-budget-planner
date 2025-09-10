import React from "react";
import { VStack, Box, Skeleton, Flex } from "@chakra-ui/react";

export const RoomSelectionSkeleton: React.FC = () => {
  const skeletonData = Array(4).fill({ titleWidth: "300px", cardCount: 3 });

  return (
    <VStack spacing={6} align="stretch" width="full">
      {skeletonData.map((section, index) => (
        <Box key={index} bg="white" borderRadius="lg">
          <Skeleton height="24px" width={section.titleWidth} m={4} />
          <Box borderTop="1px solid" borderColor="gray.200" />
          <Flex gap={6} overflowX="auto" px={4} py={3}>
            {Array.from({ length: section.cardCount }).map((_, cardIndex) => (
              <Skeleton
                key={cardIndex}
                height="160px"
                width="280px"
                borderRadius="lg"
              />
            ))}
          </Flex>
        </Box>
      ))}
    </VStack>
  );
};
