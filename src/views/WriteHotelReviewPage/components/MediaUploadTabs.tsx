import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { ChangeEvent, RefObject } from "react";
import { useTranslation } from "react-i18next";
import { DraftMedia } from "../types";
import { MediaUploadImagePanel } from "./MediaUploadImagePanel";
import { MediaUploadVideoPanel } from "./MediaUploadVideoPanel";

type MediaUploadTabsProps = {
  uploadTabIndex: number;
  onTabChange: (index: number) => void;
  imageUploadInputRef: RefObject<HTMLInputElement | null>;
  videoUploadInputRef: RefObject<HTMLInputElement | null>;
  imageMedias: DraftMedia[];
  videoMedias: DraftMedia[];
  imageCount: number;
  videoCount: number;
  onPickFiles: (event: ChangeEvent<HTMLInputElement>, mediaType: number) => void;
  onRemoveMedia: (id: string) => void;
  mediaUploadErrors: Record<string, boolean>;
  isDisabled?: boolean;
};

export const MediaUploadTabs = ({
  uploadTabIndex,
  onTabChange,
  imageUploadInputRef,
  videoUploadInputRef,
  imageMedias,
  videoMedias,
  imageCount,
  videoCount,
  onPickFiles,
  onRemoveMedia,
  mediaUploadErrors,
  isDisabled,
}: MediaUploadTabsProps) => {
  const { t } = useTranslation();

  return (
    <Tabs index={uploadTabIndex} onChange={onTabChange} variant="unstyled">
      <TabList bg="gray.100" borderRadius="lg" p="1">
        <Tab
          flex="1"
          borderRadius="md"
          fontWeight="600"
          color={uploadTabIndex === 0 ? "white" : "gray.700"}
          bg={uploadTabIndex === 0 ? "blue.500" : "transparent"}
          isDisabled={isDisabled}
        >
          {t("photos")}
        </Tab>
        <Tab
          flex="1"
          borderRadius="md"
          fontWeight="600"
          color={uploadTabIndex === 1 ? "white" : "gray.700"}
          bg={uploadTabIndex === 1 ? "blue.500" : "transparent"}
          isDisabled={isDisabled}
        >
          {t("video")}
        </Tab>
      </TabList>

      <TabPanels mt="3">
        <TabPanel p="0">
          <MediaUploadImagePanel
            imageUploadInputRef={imageUploadInputRef}
            imageMedias={imageMedias}
            imageCount={imageCount}
            onPickFiles={onPickFiles}
            onRemoveMedia={onRemoveMedia}
            mediaUploadErrors={mediaUploadErrors}
            isDisabled={isDisabled}
          />
        </TabPanel>

        <TabPanel p="0">
          <MediaUploadVideoPanel
            videoUploadInputRef={videoUploadInputRef}
            videoMedias={videoMedias}
            videoCount={videoCount}
            onPickFiles={onPickFiles}
            onRemoveMedia={onRemoveMedia}
            mediaUploadErrors={mediaUploadErrors}
            isDisabled={isDisabled}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
