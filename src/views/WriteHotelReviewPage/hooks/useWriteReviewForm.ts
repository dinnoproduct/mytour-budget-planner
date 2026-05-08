import { useCreateHotelReview, useUploadUserReviewMedia } from "@/entities/notification";
import { useModalContext } from "@app/providers";
import { useUserContext } from "@entities/user";
import { USER_REVIEW_MEDIA_TYPE } from "@/widgets/GuestReviews/helpers";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MAX_IMAGES, MAX_VIDEOS } from "../constants";
import { DraftMedia, ReviewRatings } from "../types";

const UNSUPPORTED_IMAGE_EXTENSIONS = [".heic", ".heif"];
const UNSUPPORTED_IMAGE_MIME_TYPES = ["image/heic", "image/heif"];

const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

type UseWriteReviewFormArgs = {
  hotelIdNumber: number;
  hotelName?: string;
};

export const useWriteReviewForm = ({ hotelIdNumber, hotelName }: UseWriteReviewFormArgs) => {
  const { t } = useTranslation();
  const { user, userToken } = useUserContext();
  const { dispatchModal } = useModalContext();

  const imageUploadInputRef = useRef<HTMLInputElement | null>(null);
  const videoUploadInputRef = useRef<HTMLInputElement | null>(null);

  const [description, setDescription] = useState("");
  const [ratings, setRatings] = useState<ReviewRatings>({
    location: 0,
    cleanliness: 0,
    food: 0,
  });
  const [draftMedias, setDraftMedias] = useState<DraftMedia[]>([]);
  const [uploadError, setUploadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [totalUploads, setTotalUploads] = useState(0);
  const [uploadTabIndex, setUploadTabIndex] = useState(0);
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [mediaUploadErrors, setMediaUploadErrors] = useState<Record<string, boolean>>({});

  const uploadMediaMutation = useUploadUserReviewMedia();
  const createReviewMutation = useCreateHotelReview();

  const uploadProgress = useMemo(() => {
    if (!totalUploads) return 0;
    return Math.round((uploadedCount / totalUploads) * 100);
  }, [uploadedCount, totalUploads]);
  const isFormDisabled = isSubmitting || createReviewMutation.isPending;
  const isRatingValid =
    ratings.location > 0 && ratings.cleanliness > 0 && ratings.food > 0;

  const imageMedias = useMemo(
    () =>
      draftMedias.filter((item) => item.mediaType === USER_REVIEW_MEDIA_TYPE.IMAGE),
    [draftMedias]
  );
  const videoMedias = useMemo(
    () =>
      draftMedias.filter((item) => item.mediaType === USER_REVIEW_MEDIA_TYPE.VIDEO),
    [draftMedias]
  );
  const imageCount = imageMedias.length;
  const videoCount = videoMedias.length;

  const handlePickFiles = async (
    event: React.ChangeEvent<HTMLInputElement>,
    mediaType: number
  ) => {
    if (isFormDisabled) return;
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    setUploadError("");
    setSubmitError("");
    let imagesLeft = MAX_IMAGES - imageCount;
    let videosLeft = MAX_VIDEOS - videoCount;

    const accepted: File[] = [];
    const unsupportedTypeFiles: string[] = [];

    files.forEach((file) => {
      const isVideo = file.type.startsWith("video/");
      const isImage = file.type.startsWith("image/");
      const lowerName = file.name.toLowerCase();
      const isUnsupportedImageType =
        UNSUPPORTED_IMAGE_MIME_TYPES.includes(file.type.toLowerCase()) ||
        UNSUPPORTED_IMAGE_EXTENSIONS.some((extension) => lowerName.endsWith(extension));

      if (mediaType === USER_REVIEW_MEDIA_TYPE.IMAGE && isUnsupportedImageType) {
        unsupportedTypeFiles.push(file.name);
        return;
      }

      if (mediaType === USER_REVIEW_MEDIA_TYPE.VIDEO && isVideo && videosLeft > 0) {
        accepted.push(file);
        videosLeft -= 1;
      } else if (
        mediaType === USER_REVIEW_MEDIA_TYPE.IMAGE &&
        isImage &&
        imagesLeft > 0
      ) {
        accepted.push(file);
        imagesLeft -= 1;
      }
    });

    if (!accepted.length) {
      if (unsupportedTypeFiles.length) {
        setUploadError(
          `Unsupported image format: ${unsupportedTypeFiles.join(", ")}. Please use JPG, PNG or WEBP.`
        );
      } else {
        setUploadError(
          t("reviewUploadLimitError", { images: MAX_IMAGES, videos: MAX_VIDEOS })
        );
      }
      event.target.value = "";
      return;
    }

    const prepared = await Promise.all(
      accepted.map(async (file) => {
        return {
          id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
          file,
          preview: await toBase64(file),
          mediaType,
        } satisfies DraftMedia;
      })
    );

    setDraftMedias((prev) => [...prev, ...prepared]);
    setMediaUploadErrors((prev) => {
      const next = { ...prev };
      prepared.forEach((item) => {
        delete next[item.id];
      });
      return next;
    });

    if (unsupportedTypeFiles.length) {
      setUploadError(
        `Unsupported image format: ${unsupportedTypeFiles.join(", ")}. Please use JPG, PNG or WEBP.`
      );
    } else if (accepted.length < files.length) {
      setUploadError(
        t("reviewUploadLimitError", { images: MAX_IMAGES, videos: MAX_VIDEOS })
      );
    }
    event.target.value = "";
  };

  const handleRemoveMedia = (id: string) => {
    if (isFormDisabled) return;
    setDraftMedias((prev) => prev.filter((item) => item.id !== id));
    setMediaUploadErrors((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleSubmit = async () => {
    if (isFormDisabled) return;
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
    setSubmitError("");
    setUploadedCount(0);
    setTotalUploads(draftMedias.length);
    setMediaUploadErrors({});

    try {
      const safeHotelName = (hotelName ?? "hotel")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-_]/g, "")
        .toLowerCase();
      const safeUserName = `${user?.firstName ?? ""}-${user?.lastName ?? ""}`
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-_]/g, "")
        .toLowerCase();
      const videoUploadFileName =
        [safeHotelName, safeUserName].filter(Boolean).join("-") || "hotel-user";

      const uploadedMediaResults = await Promise.allSettled(
        draftMedias.map(async (item) => {
          const result = await uploadMediaMutation.mutateAsync({
            hotelId: hotelIdNumber,
            mediaType: item.mediaType,
            file: item.file,
            fileName:
              item.mediaType === USER_REVIEW_MEDIA_TYPE.VIDEO
                ? videoUploadFileName
                : undefined,
            contentType:
              item.mediaType === USER_REVIEW_MEDIA_TYPE.VIDEO
                ? item.file.type
                : undefined,
            totalSize:
              item.mediaType === USER_REVIEW_MEDIA_TYPE.VIDEO
                ? item.file.size
                : undefined,
            totalChunks:
              item.mediaType === USER_REVIEW_MEDIA_TYPE.VIDEO
                ? 1
                : undefined,
          });

          setUploadedCount((prev) => prev + 1);

          return {
            url: result.url,
            mediaType: item.mediaType,
          };
        })
      );

      const failedUploads = uploadedMediaResults
        .map((result, index) => ({ result, media: draftMedias[index] }))
        .filter((item) => item.result.status === "rejected");

      if (failedUploads.length) {
        setMediaUploadErrors(
          failedUploads.reduce<Record<string, boolean>>((acc, item) => {
            acc[item.media.id] = true;
            return acc;
          }, {})
        );
        setSubmitError(t("reviewUploadFailedError"));
        return;
      }

      const uploadedMedia = uploadedMediaResults
        .filter((result): result is PromiseFulfilledResult<{ url: string; mediaType: number }> => {
          return result.status === "fulfilled";
        })
        .map((result) => result.value);

      await createReviewMutation.mutateAsync({
        hotelId: hotelIdNumber,
        reviewDescription: description.trim(),
        ratings,
        mediaFiles: uploadedMedia,
      });
      setIsReviewSubmitted(true);
    } catch {
      setSubmitError(t("reviewSubmitFailedError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
};
