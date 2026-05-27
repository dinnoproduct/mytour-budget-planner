import { WarningTwoIcon } from "@chakra-ui/icons";
import { Box, Flex, Image, Input as ChakraInput } from "@chakra-ui/react";
import { Button, Text } from "@ui";
import { ChangeEvent, RefObject } from "react";
import { useTranslation } from "react-i18next";
import { USER_REVIEW_MEDIA_TYPE } from "@/widgets/GuestReviews/helpers";
import { MAX_IMAGES, MAX_VIDEOS } from "../constants";
import { DraftMedia } from "../types";

type MediaUploadImagePanelProps = {
  imageUploadInputRef: RefObject<HTMLInputElement | null>;
  imageMedias: DraftMedia[];
  imageCount: number;
  onPickFiles: (event: ChangeEvent<HTMLInputElement>, mediaType: number) => void;
  onRemoveMedia: (id: string) => void;
  mediaUploadErrors: Record<string, boolean>;
  isDisabled?: boolean;
};

export const MediaUploadImagePanel = ({
  imageUploadInputRef,
  imageMedias,
  imageCount,
  onPickFiles,
  onRemoveMedia,
  mediaUploadErrors,
  isDisabled,
}: MediaUploadImagePanelProps) => {
  const { t } = useTranslation();

  const openPicker = () => {
    if (isDisabled) return;
    imageUploadInputRef.current?.click();
  };

  return (
    <Box border="1px dashed" borderColor="gray.300" borderRadius="lg" p="4">
      <ChakraInput
        ref={imageUploadInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        multiple
        display="none"
        disabled={isDisabled}
        onChange={(event) => onPickFiles(event, USER_REVIEW_MEDIA_TYPE.IMAGE)}
      />

      {!imageMedias.length ? (
        <Flex direction="column" gap="3" align="center" textAlign="center">
          <Text fontWeight="700">{t("reviewUploadTitle")}</Text>
          <Text size="sm" color="gray.600">
            {t("reviewUploadLimitHelp", {
              images: MAX_IMAGES,
              videos: MAX_VIDEOS,
            })}
          </Text>
          <Button size="sm" variant="solid-blue" width="fit-content" isDisabled={isDisabled} onClick={openPicker}>
            {t("reviewSelectFiles", { type: t("photos") })}
          </Button>
        </Flex>
      ) : (
        <Flex direction="column" gap="3">
          <Flex gap="2" flexWrap="wrap">
            {imageMedias.map((item) => (
              <Flex key={item.id} direction="column" w="102px" gap="1">
                <Flex
                  position="relative"
                  w="102px"
                  h="102px"
                  borderRadius="md"
                  overflow="hidden"
                  border={mediaUploadErrors[item.id] ? "1px solid" : "none"}
                  borderColor={mediaUploadErrors[item.id] ? "red.400" : "transparent"}
                >
                  <Image
                    src={item.preview}
                    alt={item.file.name}
                    width="100%"
                    height="100%"
                    objectFit="cover"
                  />
                  <Button
                    variant="solid-red"
                    size="xs"
                    position="absolute"
                    top="1"
                    right="1"
                    isDisabled={isDisabled}
                    onClick={() => onRemoveMedia(item.id)}
                  >
                    ✕
                  </Button>
                  {mediaUploadErrors[item.id] ? (
                    <Flex
                      position="absolute"
                      top="1"
                      left="1"
                      w="20px"
                      h="20px"
                      borderRadius="full"
                      bg="red.500"
                      align="center"
                      justify="center"
                    >
                      <WarningTwoIcon color="white" boxSize="10px" />
                    </Flex>
                  ) : null}
                </Flex>
              </Flex>
            ))}
            {imageCount < MAX_IMAGES && (
              <Flex
                w="102px"
                h="102px"
                border="1px dashed"
                borderColor="gray.300"
                borderRadius="md"
                align="center"
                justify="center"
                cursor={isDisabled ? "not-allowed" : "pointer"}
                opacity={isDisabled ? 0.6 : 1}
                onClick={openPicker}
              >
                <Text color="gray.500">+</Text>
              </Flex>
            )}
          </Flex>
          <Text size="sm" color="gray.600" textAlign="center">
            {t("reviewPhotosUploaded", {
              count: imageCount,
              max: MAX_IMAGES,
            })}
          </Text>
        </Flex>
      )}
    </Box>
  );
};
