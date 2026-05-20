import {
  Box,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { Button, Text } from "@ui";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import {
  getReviewMediaPreviewUrl,
  getYoutubeEmbedUrl,
  USER_REVIEW_MEDIA_TYPE,
} from "../helpers";

type ReviewMediaModalProps = {
  isOpen: boolean;
  onClose: () => void;
  medias: { url: string; mediaType: number }[];
  initialIndex?: number;
};

export const ReviewMediaModal = ({
  isOpen,
  onClose,
  medias,
  initialIndex = 0,
}: ReviewMediaModalProps) => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      setActiveIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  const activeMedia = useMemo(
    () => medias[activeIndex] ?? medias[0],
    [activeIndex, medias]
  );
  const activeVideoEmbedUrl = useMemo(() => {
    if (!activeMedia || activeMedia.mediaType !== USER_REVIEW_MEDIA_TYPE.VIDEO) {
      return null;
    }

    return getYoutubeEmbedUrl(activeMedia.url);
  }, [activeMedia]);

  const goPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? medias.length - 1 : prev - 1));
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev === medias.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (!isOpen || medias.length <= 1) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, medias.length]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="full">
      <ModalOverlay />
      <ModalContent
        w={{ base: "100%", md: "650px" }}
        h={{ base: "100%", md: "550px" }}
        maxW={{ base: "100%", md: "650px" }}
        maxH={{ base: "100%", md: "550px" }}
        m={{ base: 0, md: "16px" }}
        minH={'fit-content'}
        borderRadius={{ base: 0, md: "24px" }}
        overflow="hidden"
      >
        <ModalHeader p="0">
          <Flex
            borderBottom="1px solid"
            borderColor="gray.100"
            width="full"
            justify="space-between"
            align="center"
            py="4"
            px="6"
          >
            <Text fontWeight="600" fontSize="20px" color="gray.900">
              {t("photosAndVideos")}
            </Text>
            <Button icon="close" onClick={onClose} variant="text-blue" size="lg" />
          </Flex>
        </ModalHeader>

        <ModalBody p={{ base: "4", md: "6" }}>
          <Flex direction="column" gap="4" align="center">
            <Box
              width="full"
              h={{ base: "calc(100vh - 190px)", md: "580px" }}
              maxH={{ base: "calc(100vh - 190px)", md: "580px" }}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {activeMedia && activeVideoEmbedUrl ? (
                <Box width="100%" maxW="100%" maxH="100%" aspectRatio={16 / 9}>
                  <iframe
                    src={activeVideoEmbedUrl}
                    title="YouTube video player"
                    width="100%"
                    height="100%"
                    style={{ border: 0, borderRadius: "12px" }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </Box>
              ) : activeMedia ? (
                <Image
                  src={getReviewMediaPreviewUrl(activeMedia)}
                  alt={activeMedia.url}
                  width="auto"
                  height="auto"
                  maxW="100%"
                  maxH="100%"
                  objectFit="contain"
                  borderRadius="lg"
                />
              ) : null}
            </Box>

            {medias.length > 1 ? (
              <Flex align="center" gap="4">
                <Button
                  icon="chevron-left"
                  onClick={goPrev}
                  variant="solid-gray"
                  size="sm"
                  aria-label="Previous image"
                />
                <Text size="sm" fontWeight="semibold" color="gray.700">
                  {activeIndex + 1}/{medias.length}
                </Text>
                <Button
                  icon="chevron-right"
                  onClick={goNext}
                  variant="solid-gray"
                  size="sm"
                  aria-label="Next image"
                />
              </Flex>
            ) : null}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
