"use client";

import {
  Box,
  Flex,
  Image,
  Input as ChakraInput,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Textarea,
} from "@chakra-ui/react";
import { Button, Input, Progress, Text } from "@ui";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "@shared/lib/router";
import {
  useCreateHotelReview,
  useUploadUserReviewMedia,
} from "@/entities/notification";
import { useReviewHotelMeta } from "@/entities/package";
import { useUserContext } from "@entities/user";
import { useModalContext } from "@app/providers";
import { useLanguageNavigate } from "@/hooks/useLanguageNavigate";
import { USER_REVIEW_MEDIA_TYPE } from "@/widgets/GuestReviews/helpers";
import { PageLayout } from "@/shared/ui/layout/PageLayout";

type DraftMedia = {
  id: string;
  file: File;
  preview: string;
  mediaType: number;
};

const MAX_IMAGES = 10;
const MAX_VIDEOS = 3;

const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const WriteHotelReviewPage = () => {
  const { t } = useTranslation();
  const { hotelId } = useParams() as {
    hotelId?: string;
  };
  const { user, userToken } = useUserContext();
  const { dispatchModal } = useModalContext();
  const { navigateBack } = useLanguageNavigate();

  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  const [description, setDescription] = useState("");
  const [ratings, setRatings] = useState({
    location: 10,
    cleanliness: 10,
    food: 10,
  });
  const [draftMedias, setDraftMedias] = useState<DraftMedia[]>([]);
  const [uploadError, setUploadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [totalUploads, setTotalUploads] = useState(0);

  const uploadMediaMutation = useUploadUserReviewMedia();
  const createReviewMutation = useCreateHotelReview();

  const hotelIdNumber = Number(hotelId ?? 0);
  const { data: hotelMeta, isLoading: isHotelMetaLoading } = useReviewHotelMeta({
    id: hotelIdNumber,
  });

  const uploadProgress = useMemo(() => {
    if (!totalUploads) return 0;
    return Math.round((uploadedCount / totalUploads) * 100);
  }, [uploadedCount, totalUploads]);

  const imageCount = draftMedias.filter(
    (item) => item.mediaType === USER_REVIEW_MEDIA_TYPE.IMAGE
  ).length;
  const videoCount = draftMedias.filter(
    (item) => item.mediaType === USER_REVIEW_MEDIA_TYPE.VIDEO
  ).length;

  const handlePickFiles = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    setUploadError("");
    let imagesLeft = MAX_IMAGES - imageCount;
    let videosLeft = MAX_VIDEOS - videoCount;

    const accepted: File[] = [];

    files.forEach((file) => {
      const isVideo = file.type.startsWith("video/");
      if (isVideo && videosLeft > 0) {
        accepted.push(file);
        videosLeft -= 1;
      } else if (!isVideo && imagesLeft > 0) {
        accepted.push(file);
        imagesLeft -= 1;
      }
    });

    if (!accepted.length) {
      setUploadError(
        t("reviewUploadLimitError", { images: MAX_IMAGES, videos: MAX_VIDEOS })
      );
      event.target.value = "";
      return;
    }

    const prepared = await Promise.all(
      accepted.map(async (file) => {
        const mediaType = file.type.startsWith("video/")
          ? USER_REVIEW_MEDIA_TYPE.VIDEO
          : USER_REVIEW_MEDIA_TYPE.IMAGE;

        return {
          id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
          file,
          preview: await toBase64(file),
          mediaType,
        } satisfies DraftMedia;
      })
    );

    setDraftMedias((prev) => [...prev, ...prepared]);

    if (accepted.length < files.length) {
      setUploadError(
        t("reviewUploadLimitError", { images: MAX_IMAGES, videos: MAX_VIDEOS })
      );
    }
    event.target.value = "";
  };

  const handleRemoveMedia = (id: string) => {
    setDraftMedias((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async () => {
    if (!hotelIdNumber) return;

    if (!user || !userToken) {
      dispatchModal({
        type: "open",
        modalType: "auth",
        props: { view: "signIn" },
      });
      return;
    }

    setIsSubmitting(true);
    setUploadedCount(0);
    setTotalUploads(draftMedias.length);

    try {
      const uploadedMedia = await Promise.all(
        draftMedias.map(async (item) => {
          const result = await uploadMediaMutation.mutateAsync({
            hotelId: hotelIdNumber,
            mediaType: item.mediaType,
            file: item.file,
          });

          setUploadedCount((prev) => prev + 1);

          return {
            url: result.url,
            mediaType: item.mediaType,
          };
        })
      );

      await createReviewMutation.mutateAsync({
        hotelId: hotelIdNumber,
        reviewDescription: description.trim(),
        ratings,
        mediaFiles: uploadedMedia,
      });

      navigateBack();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <Flex direction="column" gap="6" px={{ base: 4, md: 0 }} pb="8">
      {isHotelMetaLoading ? (
        <Text color="gray.600" fontSize="sm">
          {t("loading.packages.title")}
        </Text>
      ) : null}
      {hotelMeta?.hotelImageUrl ? (
        <Image
          src={hotelMeta.hotelImageUrl}
          alt={hotelMeta.hotelName || "hotel"}
          w="full"
          h={{ base: "210px", md: "320px" }}
          objectFit="cover"
          borderRadius="xl"
        />
      ) : null}

      <Flex direction="column" gap="1">
        {hotelMeta?.hotelName ? (
          <Text fontWeight="700" fontSize={{ base: "22px", md: "28px" }}>
            {hotelMeta.hotelName}
          </Text>
        ) : null}
        {hotelMeta?.hotelLocation ? (
          <Text color="gray.600" fontSize="sm">
            {hotelMeta.hotelLocation}
          </Text>
        ) : null}
      </Flex>

      <Box border="1px dashed" borderColor="gray.300" borderRadius="lg" p="4">
        <Flex direction="column" gap="3">
          <Text fontWeight="600">{t("reviewUploadTitle")}</Text>
          <Text size="sm" color="gray.600">
            {t("reviewUploadLimitHelp", { images: MAX_IMAGES, videos: MAX_VIDEOS })}
          </Text>
          <ChakraInput
            ref={uploadInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            display="none"
            onChange={handlePickFiles}
          />
          <Button
            size="sm"
            variant="outline-blue"
            width="fit-content"
            onClick={() => uploadInputRef.current?.click()}
          >
            {t("reviewSelectFiles")}
          </Button>

          {!!uploadError && (
            <Text color="red.500" size="sm">
              {uploadError}
            </Text>
          )}

          {!!draftMedias.length && (
            <Flex gap="2" flexWrap="wrap">
              {draftMedias.map((item) => (
                <Flex
                  key={item.id}
                  position="relative"
                  w={{ base: "96px", md: "120px" }}
                  h={{ base: "72px", md: "88px" }}
                  borderRadius="md"
                  overflow="hidden"
                >
                  {item.mediaType === USER_REVIEW_MEDIA_TYPE.VIDEO ? (
                    <video src={item.preview} width="100%" height="100%" />
                  ) : (
                    <Image
                      src={item.preview}
                      alt={item.file.name}
                      width="100%"
                      height="100%"
                      objectFit="cover"
                    />
                  )}
                  <Button
                    variant="solid-gray"
                    size="xs"
                    position="absolute"
                    top="1"
                    right="1"
                    onClick={() => handleRemoveMedia(item.id)}
                  >
                    ✕
                  </Button>
                </Flex>
              ))}
            </Flex>
          )}
        </Flex>
      </Box>

      <Input
        label={t("reviewUserNameLabel")}
        value={user ? `${user.firstName} ${user.lastName}` : ""}
        isReadOnly
        placeholder={t("reviewSignInToPost")}
      />

      <Box>
        <Text fontWeight="600" mb="2">
          {t("reviewDescriptionLabel")}
        </Text>
        <Textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          minH="120px"
          placeholder={t("reviewDescriptionPlaceholder")}
        />
      </Box>

      <Flex direction="column" gap="4">
        <RatingSlider
          label={t("location")}
          value={ratings.location}
          onChange={(value) => setRatings((prev) => ({ ...prev, location: value }))}
        />
        <RatingSlider
          label={t("cleanliness")}
          value={ratings.cleanliness}
          onChange={(value) =>
            setRatings((prev) => ({ ...prev, cleanliness: value }))
          }
        />
        <RatingSlider
          label={t("food")}
          value={ratings.food}
          onChange={(value) => setRatings((prev) => ({ ...prev, food: value }))}
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
          isDisabled={isSubmitting || createReviewMutation.isPending}
        >
          {t("reviewSubmit")}
        </Button>
      </Flex>
    </PageLayout>
  );
};

const RatingSlider = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) => (
  <Flex direction="column" gap="2">
    <Flex justify="space-between" align="center">
      <Text fontWeight="600">{label}</Text>
      <Text fontWeight="600">{value}/10</Text>
    </Flex>
    <Slider min={1} max={10} step={1} value={value} onChange={onChange}>
      <SliderTrack bg="gray.100">
        <SliderFilledTrack bg="blue.500" />
      </SliderTrack>
      <SliderThumb />
    </Slider>
  </Flex>
);
