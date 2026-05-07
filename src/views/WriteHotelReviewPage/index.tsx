"use client";

import {
  Box,
  Flex,
  Image,
  Textarea,
} from "@chakra-ui/react";
import { Button, Progress, Text } from "@ui";
import { useTranslation } from "react-i18next";
import { useParams } from "@shared/lib/router";
import { useReviewHotelMeta } from "@/entities/package";
import { useLanguageNavigate } from "@/hooks/useLanguageNavigate";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { MediaUploadTabs } from "./components/MediaUploadTabs";
import { RatingSelector } from "./components/RatingSelector";
import { ReviewSuccessState } from "./components/ReviewSuccessState";
import { useWriteReviewForm } from "./hooks/useWriteReviewForm";

export const WriteHotelReviewPage = () => {
  const { t } = useTranslation();
  const { hotelId } = useParams() as {
    hotelId?: string;
  };
  const { navigateBack } = useLanguageNavigate();

  const hotelIdNumber = Number(hotelId ?? 0);
  const { data: hotelMeta, isLoading: isHotelMetaLoading } = useReviewHotelMeta({
    id: hotelIdNumber,
  });
  const {
    description,
    setDescription,
    ratings,
    setRatings,
    uploadError,
    submitError,
    isSubmitting,
    uploadedCount,
    totalUploads,
    uploadProgress,
    uploadTabIndex,
    setUploadTabIndex,
    isReviewSubmitted,
    isFormDisabled,
    isRatingValid,
    imageCount,
    videoCount,
    imageMedias,
    videoMedias,
    mediaUploadErrors,
    imageUploadInputRef,
    videoUploadInputRef,
    handlePickFiles,
    handleRemoveMedia,
    handleSubmit,
  } = useWriteReviewForm({ hotelIdNumber });

  return (
    <PageLayout bg="gray.50" footerProps={{ mt: 0 }}>
      <Flex justify="center" px={{ base: 3, md: 6 }} py={{ base: 4, md: 8 }}>
        <Box
          width="full"
          maxW="420px"
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="xl"
          overflow="hidden"
          boxShadow="sm"
        >
          {hotelMeta?.hotelImageUrl ? (
            <Image
              src={hotelMeta.hotelImageUrl}
              alt={hotelMeta.hotelName || "hotel"}
              w="full"
              h="180px"
              objectFit="cover"
            />
          ) : null}

          <Flex direction="column" gap="4" p="4">
            {isReviewSubmitted ? (
              <ReviewSuccessState onClose={() => navigateBack()} />
            ) : (
              <>
                {isHotelMetaLoading ? (
                  <Text color="gray.600" fontSize="sm">
                    {t("loading.packages.title")}
                  </Text>
                ) : null}

                <Flex direction="column" gap="1">
                  {hotelMeta?.hotelName ? (
                    <Text fontWeight="700" fontSize="22px">
                      {hotelMeta.hotelName}
                    </Text>
                  ) : null}
                  {hotelMeta?.hotelLocation ? (
                    <Text color="gray.600" fontSize="sm">
                      {hotelMeta.hotelLocation}
                    </Text>
                  ) : null}
                </Flex>

                <MediaUploadTabs
                  uploadTabIndex={uploadTabIndex}
                  onTabChange={(index) => {
                    if (isFormDisabled) return;
                    setUploadTabIndex(index);
                  }}
                  imageUploadInputRef={imageUploadInputRef}
                  videoUploadInputRef={videoUploadInputRef}
                  imageMedias={imageMedias}
                  videoMedias={videoMedias}
                  imageCount={imageCount}
                  videoCount={videoCount}
                  onPickFiles={handlePickFiles}
                  onRemoveMedia={handleRemoveMedia}
                  mediaUploadErrors={mediaUploadErrors}
                  isDisabled={isFormDisabled}
                />

                {!!uploadError && (
                  <Text color="red.500" size="sm">
                    {uploadError}
                  </Text>
                )}
                {!!submitError && (
                  <Text color="red.500" size="sm">
                    {submitError}
                  </Text>
                )}

                <Box>
                  <Text fontWeight="600" mb="2">
                    {t("reviewDescriptionLabel")}
                  </Text>
                  <Textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    minH="100px"
                    placeholder={t("reviewDescriptionPlaceholder")}
                    isDisabled={isFormDisabled}
                  />
                </Box>

                <Flex direction="column" gap="3">
                  <RatingSelector
                    label={t("location")}
                    value={ratings.location}
                    onChange={(value) =>
                      setRatings((prev) => ({ ...prev, location: value }))
                    }
                    isDisabled={isFormDisabled}
                  />
                  <RatingSelector
                    label={t("cleanliness")}
                    value={ratings.cleanliness}
                    onChange={(value) =>
                      setRatings((prev) => ({ ...prev, cleanliness: value }))
                    }
                    isDisabled={isFormDisabled}
                  />
                  <RatingSelector
                    label={t("food")}
                    value={ratings.food}
                    onChange={(value) => setRatings((prev) => ({ ...prev, food: value }))}
                    isDisabled={isFormDisabled}
                  />
                </Flex>

                {isSubmitting ? (
                  <Flex direction="column" gap="2">
                    <Text size="sm" color="gray.700">
                      {t("reviewUploadProgressLabel", {
                        uploaded: uploadedCount,
                        total: totalUploads,
                      })}
                    </Text>
                    <Progress value={uploadProgress} />
                  </Flex>
                ) : null}

                <Button
                  variant="solid-blue"
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  isDisabled={isFormDisabled || !isRatingValid}
                >
                  {t("reviewSubmit")}
                </Button>
              </>
            )}
          </Flex>
        </Box>
      </Flex>
    </PageLayout>
  );
};
