import { WarningTwoIcon } from "@chakra-ui/icons";
import { Box, Flex, Input as ChakraInput } from "@chakra-ui/react";
import { Button, Text } from "@ui";
import { ChangeEvent, RefObject } from "react";
import { useTranslation } from "react-i18next";
import { USER_REVIEW_MEDIA_TYPE } from "@/widgets/GuestReviews/helpers";
import { MAX_VIDEOS } from "../constants";
import { DraftMedia } from "../types";

type MediaUploadVideoPanelProps = {
  videoUploadInputRef: RefObject<HTMLInputElement | null>;
  videoMedias: DraftMedia[];
  videoCount: number;
  onPickFiles: (event: ChangeEvent<HTMLInputElement>, mediaType: number) => void;
  onRemoveMedia: (id: string) => void;
  mediaUploadErrors: Record<string, boolean>;
  isDisabled?: boolean;
};

export const MediaUploadVideoPanel = ({
  videoUploadInputRef,
  videoMedias,
  videoCount,
  onPickFiles,
  onRemoveMedia,
  mediaUploadErrors,
  isDisabled,
}: MediaUploadVideoPanelProps) => {
  const { t } = useTranslation();

  const openPicker = () => {
    if (isDisabled) return;
    videoUploadInputRef.current?.click();
  };

  return (
    <Box border="1px dashed" borderColor="gray.300" borderRadius="lg" p="4">
      <ChakraInput
        ref={videoUploadInputRef}
        type="file"
        accept="video/*"
        multiple
        display="none"
        disabled={isDisabled}
        onChange={(event) => onPickFiles(event, USER_REVIEW_MEDIA_TYPE.VIDEO)}
      />

      {!videoMedias.length ? (
        <Flex direction="column" gap="3" align="center" textAlign="center">
          <Text fontWeight="700">{t("reviewUploadVideosTitle")}</Text>
          <Text size="sm" color="gray.600">
            {t("reviewVideoUploadLimitHelp", { videos: MAX_VIDEOS })}
          </Text>
          <Button size="sm" variant="solid-blue" width="fit-content" isDisabled={isDisabled} onClick={openPicker}>
            {t("reviewSelectFiles", { type: t("video") })}
          </Button>
        </Flex>
      ) : (
        <Flex direction="column" gap="2">
          {videoMedias.map((item) => (
            <Flex
              key={item.id}
              border="1px solid"
              borderColor={mediaUploadErrors[item.id] ? "red.400" : "gray.200"}
              borderRadius="md"
              px="3"
              py="2"
              justify="space-between"
              align="center"
            >
              <Flex direction="column" minW="0" flex="1">
                <Text size="sm" fontWeight="600" noOfLines={1}>
                  {item.file.name}
                </Text>
                <Text size="xs" color="gray.500">
                  {(item.file.size / (1024 * 1024)).toFixed(1)} MB
                </Text>
              </Flex>
              <Flex align="center" gap="2">
                {mediaUploadErrors[item.id] ? (
                  <WarningTwoIcon color="red.500" boxSize="14px" />
                ) : null}
                <Button
                  variant="solid-red"
                  size="xs"
                  isDisabled={isDisabled}
                  onClick={() => onRemoveMedia(item.id)}
                >
                  ✕
                </Button>
              </Flex>
            </Flex>
          ))}
          {videoCount < MAX_VIDEOS && (
            <Button
              size="sm"
              variant="outline-blue"
              width="fit-content"
              isDisabled={isDisabled}
              onClick={openPicker}
            >
              {t("reviewSelectFiles", { type: t("video") })}
            </Button>
          )}
        </Flex>
      )}
    </Box>
  );
};
