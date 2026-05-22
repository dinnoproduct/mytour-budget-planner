import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { SystemStyleObject } from "@chakra-ui/system";
import { RefObject } from "react";
import { getReviewMediaPreviewUrl, USER_REVIEW_MEDIA_TYPE } from "../helpers";

type MediaItem = {
  url: string;
  mediaType: number;
};

type ReviewMediaStripProps = {
  medias: MediaItem[];
  size?: "large" | "small";
  containerRef?: RefObject<HTMLDivElement | null>;
  scrollbarSx?: SystemStyleObject;
  onImageClick?: (index: number) => void;
};

export const ReviewMediaStrip = ({
  medias,
  size = "large",
  containerRef,
  scrollbarSx,
  onImageClick,
}: ReviewMediaStripProps) => {
  if (!medias?.length) return null;

  const isLarge = size === "large";

  return (
    <Flex
      ref={containerRef}
      gap="2"
      overflowX="auto"
      mt={isLarge ? 0 : "2"}
      flexWrap="nowrap"
      sx={scrollbarSx}
    >
      {medias.map((media, index) => (
        <Flex
          key={media.url + media.mediaType}
          width={isLarge ? "140px" : "70px"}
          height={isLarge ? "100px" : "50px"}
          borderRadius={isLarge ? "lg" : "8px"}
          overflow="hidden"
          flexShrink={0}
          position="relative"
          cursor={onImageClick ? "pointer" : "default"}
          onClick={() => onImageClick?.(index)}
        >
          <Image
            src={getReviewMediaPreviewUrl(media)}
            alt={media.url}
            width="100%"
            height="100%"
            objectFit="cover"
          />
          {media.mediaType === USER_REVIEW_MEDIA_TYPE.VIDEO && (
            <Flex
              position="absolute"
              inset={0}
              bg="blackAlpha.500"
              align="center"
              justify="center"
            >
              <Flex
                backgroundColor="gray.200"
                rounded="full"
                p="2"
                width="30px"
                height="30px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text color="gray.800" fontWeight="700" fontSize="sm" >
                  ▶
                </Text>
              </Flex>
            </Flex>
          )}
        </Flex>
      ))}
    </Flex>
  );
};
