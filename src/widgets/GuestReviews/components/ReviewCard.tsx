import { Box, Flex, Image, Tag, useBreakpointValue } from "@chakra-ui/react";
import { Button, Text } from "@ui";
import { useTranslation } from "react-i18next";
import {
  formatRate,
  getReviewScore,
  getReviewMediaPreviewUrl,
  publishDate,
  USER_REVIEW_MEDIA_TYPE,
} from "../helpers";

type ReviewCardProps = {
  review: {
    id: number;
    firstName: string;
    lastName: string;
    reviewDate?: string | Date;
    reviewDescription: string;
    ratings: { location: number; cleanliness: number; food: number };
    mediaFiles: { url: string; mediaType: number }[];
  };
  isExpanded: boolean;
  shouldShowToggle: boolean;
  onToggleExpand: () => void;
  onMediaClick?: (index: number) => void;
  isFullWidth?: boolean;
};

export const ReviewCard = ({
  review,
  isExpanded,
  shouldShowToggle,
  onToggleExpand,
  onMediaClick,
  isFullWidth = false,
}: ReviewCardProps) => {
  const { t } = useTranslation();
  const reviewScore = getReviewScore(review);
  const mediaLimit = useBreakpointValue({ base: 3, md: 5 }) ?? 5;
  const hasMoreMedias = review.mediaFiles.length > mediaLimit;
  const visibleMedias = hasMoreMedias
    ? review.mediaFiles.slice(0, mediaLimit)
    : review.mediaFiles;
  const hiddenMediaCount = review.mediaFiles.length - (mediaLimit - 1);

  return (
    <Flex
      direction="column"
      p={{ base: 4, md: 6 }}
      gap={2}
      key={review.id}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="2xl"
      minW={isFullWidth ? "100%" : { base: "350px", md: "480px" }}
      maxW={isFullWidth ? "100%" : { base: "350px", md: "480px" }}
    >
      <Flex justifyContent="space-between" width="full" alignItems="center">
        <Flex alignItems="center" gap="2">
          <Text color="gray.700" fontWeight="semibold" fontSize="16px">
            {review.firstName}
          </Text>
          <Tag
            variant="subtle-success"
            px={3}
            rounded="full"
            flexShrink={0}
            whiteSpace="nowrap"
            alignItems="center"
            gap={2}
          >
            <Text color={'green.500'} fontWeight="semibold" fontSize="12px">
              {formatRate(reviewScore)}/10
            </Text>
          </Tag>
        </Flex>
        <Text color="gray.500" fontWeight="500" fontSize="12px">
          {review.reviewDate && publishDate(review.reviewDate, t)}
        </Text>
      </Flex>

      <Flex direction="column" gap="2">
        <Box
          overflow="hidden"
          maxHeight={isExpanded ? "2000px" : "45px"}
          transition="max-height 0.5s ease"
        >
          <Text
            fontSize="14px"
            color="gray.700"
            fontWeight="400"
            sx={
              isExpanded
                ? undefined
                : {
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }
            }
          >
            {review.reviewDescription}
          </Text>
        </Box>
        {shouldShowToggle && (
          <Flex justifyContent="flex-end">
            <Button
              variant="text-blue"
              size="sm"
              width="fit-content"
              px={0}
              minHeight="auto"
              height="auto"
              onClick={onToggleExpand}
            >
              {isExpanded ? t`close` : t`more`}
            </Button>
          </Flex>
        )}
      </Flex>

      {!!visibleMedias.length && (
        <Flex gap="2" mt="2" flexWrap="nowrap">
          {visibleMedias.map((media, index) => {
            const isOverlayItem = hasMoreMedias && index === mediaLimit - 1;
            return (
              <Flex
                key={media.url + media.mediaType}
                width={{ base: "calc(33% - 4px)", md: "calc(20% - 4px)" }}
                height={{ base: "70px", md: isFullWidth ? "100px" : "60px" }}
                borderRadius="8px"
                overflow="hidden"
                flexShrink={0}
                position="relative"
                cursor={onMediaClick ? "pointer" : "default"}
                onClick={() => onMediaClick?.(index)}
              >
                <Image
                  src={getReviewMediaPreviewUrl(media)}
                  alt={media.url}
                  width="100%"
                  height="100%"
                  objectFit="cover"
                />
                {media.mediaType === USER_REVIEW_MEDIA_TYPE.VIDEO && !isOverlayItem && (
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
                      width="6"
                      height="6"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text color="gray.800" fontWeight="700" fontSize="xs" >
                        ▶
                      </Text>
                    </Flex>
                  </Flex>
                )}
                {isOverlayItem && (
                  <Flex
                    position="absolute"
                    inset={0}
                    bg="blackAlpha.600"
                    align="center"
                    justify="center"
                  >
                    <Button variant="solid-gray" size="xs" pointerEvents="none">
                      +{hiddenMediaCount}
                    </Button>
                  </Flex>
                )}
              </Flex>
            );
          })}
        </Flex>
      )}
    </Flex>
  );
};
