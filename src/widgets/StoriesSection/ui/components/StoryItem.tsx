import { Avatar, Box, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { type StoryGroup } from "../types";

interface StoryItemProps {
  group: StoryGroup;
  onOpen: (storySetId: number) => void;
  isHotel?: number;
}

export const StoryItem: React.FC<StoryItemProps> = React.memo(
  ({ group, onOpen, isHotel = 0 }) => {
    const { storySet } = group;
    const avatarImageUrl = storySet.avatarImageUrl;
    const gradientColor =
      isHotel === 0 ? "gr_Hotel" : isHotel === 1 ? "gr_Packages" : "gr_GroupTours";

    return (
      <VStack
        align="center"
        spacing={1}
        maxW={{ base: "76px", sm: "100px" }}
        cursor="pointer"
        onClick={() => onOpen(storySet.id)}
        _hover={{ opacity: 0.8 }}
        flexShrink={0}
        zIndex={1000}
      >
        <Box
          width={{ base: 14, sm: 20 }}
          height={{ base: 14, sm: 20 }}
          padding={{ base: 0.5, sm: "3.143px" }}
          bg={gradientColor}
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            padding={{ base: 0.5, sm: "3px" }}
            width="100%"
            height="100%"
            bg="white"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
          >
            <Avatar
              name={storySet.name}
              src={avatarImageUrl}
              width="100%"
              height="100%"
              loading="lazy"
              borderRadius="full"
            />
          </Box>
        </Box>

        <Text
          fontSize="xs"
          fontWeight="medium"
          color="gray.700"
          textAlign="center"
          noOfLines={2}
        >
          {storySet.name}
        </Text>
      </VStack>
    );
  },
);

StoryItem.displayName = "StoryItem";
