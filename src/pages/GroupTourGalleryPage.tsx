import { Box, Flex, Grid, GridItem, useBreakpoint } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useRef, useState, useMemo } from "react";
import Loader from "@/components/Loader/Loader";
import { useGroupTourInfo } from "@entities/package";
import { useLanguageNavigate } from "@/hooks/useLanguageNavigate";
import { PackageDetailsHeader as SharedHeader } from "@/shared/ui/layout/PackageDetailsHeader";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { GalleryImage, PackageImagesSliderModal } from "@features/PackageImagesGallery";
import ImagesSlider from "@features/PackageImagesGallery/ui/ImagesSlider.tsx";
import { useTranslation } from "react-i18next";
import type { GroupTourGalleryItem } from "@entities/package";
import { LANGUAGE_PREFIX, type LanguageName } from "@shared/model";
import { getLocalized } from "@/widgets/GroupTourDetails/lib/utils";

// Group only image items by their attribute (section name, localized)
const groupGalleryByAttribute = (gallery: GroupTourGalleryItem[]) => {
  const byAttribute = new Map<string, GroupTourGalleryItem[]>();
  const sorted = [...gallery]
    .filter((item) => (item.type ?? "").toLowerCase() === "image" || !item.type)
    .sort((a, b) => a.order - b.order);

  for (const item of sorted) {
    const attr = item.attribute;
    const key =
      (attr && (attr.eng || attr.arm || attr.rus)) ||
      "Other";
    if (!byAttribute.has(key)) {
      byAttribute.set(key, []);
    }
    byAttribute.get(key)!.push(item);
  }

  return Array.from(byAttribute.entries());
};

export const GroupTourGalleryPage = () => {
  const { id: tourId } = useParams<{ id: string }>();
  const { data: groupTour, isLoading, isFetched } = useGroupTourInfo(tourId);
  const { navigateBack } = useLanguageNavigate();
  const { t, i18n } = useTranslation();
  const [isModalOpen, setModalOpen] = useState(false);
  const [imageModalActiveIndex, setImageModalActiveIndex] = useState(0);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const languageSuffix = useMemo(
    () => (LANGUAGE_PREFIX[i18n.language as LanguageName] ?? "eng").toLowerCase(),
    [i18n.language]
  );

  const groupedSections = useMemo(
    () => (groupTour?.gallery ? groupGalleryByAttribute(groupTour.gallery) : []),
    [groupTour?.gallery]
  );

  const handleBackClick = () => {
    navigateBack();
  };

  const handleTabClick = (attribute: string) => {
    const el = sectionRefs.current.get(attribute);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const headerOffset = 100;
    const scrollTop = window.scrollY + rect.top - headerOffset;

    window.scrollTo({
      top: scrollTop,
      behavior: "smooth",
    });
  };

  const handleImageClick = (items: GroupTourGalleryItem[], index: number) => {
    const imagesOnly = items.filter(
      (item) => (item.type ?? "").toLowerCase() === "image" || !item.type
    );
    setModalImages(imagesOnly.map((item) => item.url));
    setImageModalActiveIndex(index);
    setModalOpen(true);
  };

  if (!tourId) {
    return null;
  }

  if (isLoading || !groupTour) {
    return <Loader loading />;
  }

  return (
    <PageLayout
      mb={{ base: "117px", md: "0" }}
      footerProps={{ mt: { base: "100px", md: "0px" } }}
    >
      <SharedHeader onBackClick={handleBackClick} title={t("back")} />

      <Box
        maxW="1188px"
        mx={{base: 0, md: "auto"}}
        px={{ base: 4, md: 6 }}
        py={{ base: 4, md: 8 }}
      >
        <Flex
          fontSize="2xl"
          fontWeight="bold"
          color="gray.800"
          mb={4}
        >
          {t("photos")}
        </Flex>

        {/* Horizontal tabs */}
        <Flex
          gap={3}
          overflowX="auto"
          pb={4}
          mb={6}
          borderBottom="1px solid"
          borderColor="gray.100"
          sx={{
            "&::-webkit-scrollbar": { height: "4px" },
            "&::-webkit-scrollbar-thumb": { background: "#E2E8F0", borderRadius: "2px" },
          }}
        >
          {groupedSections.map(([type, items]) => (
            <Flex
              key={type}
              direction="column"
              align="flex-start"
              flexShrink={0}
              gap={4}
              cursor="pointer"
              onClick={() => handleTabClick(type)}
              minW="184px"
            >
              <Box
                w="184px"
                h="100px"
                borderRadius="md"
                overflow="hidden"
                bg="gray.100"
              >
                {items[0]?.url && (
                  <GalleryImage
                    src={items[0].url}
                    width="100%"
                    height="100%"
                    objectFit="cover"
                  />
                )}
              </Box>
              <Box
                fontSize="sm"
                color="gray.800"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                fontWeight={"medium"}
                maxW="100%"
                textTransform="capitalize"
              >
                {type}
              </Box>
            </Flex>
          ))}
        </Flex>

        {/* Sections */}
        {groupedSections.map(([attributeKey, items]) => {
          const localizedAttribute =
            getLocalized(items[0]?.attribute, languageSuffix) || attributeKey;

          return (
          <Box
            key={attributeKey}
            ref={(el) => {
              if (el) sectionRefs.current.set(attributeKey, el);
            }}
            mb={6}
          >
            <Flex fontSize="2xl" fontWeight="bold" color="gray.800" mb={4} textTransform="capitalize">
              {localizedAttribute}
            </Flex>

            <Box display={{base: "block", md: "none"}}>
              {
              items.length > 1 ? (
                  <ImagesSlider imageUrls={items.map((item) => item.url)} width="100%" height="100%" />
                ) : (
                  <GalleryImage src={items[0].url} width="100%" height="288px" objectFit="cover" />
                  // <GalleryImage src={items[0].url} width="100%" height="100%" objectFit="cover" />
                )
              }
              {/* <ImagesSlider imageUrls={items.map((item) => item.url)} width="100%" height="100%" /> */}
            </Box>
            
            <Grid
              templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
              gap={4}
              sx={{ display: { base: "none", md: "grid" } }}
            >
              {items.map((item, idx) => (
                <GridItem
                  key={`${item.url}-${idx}`}
                  cursor="pointer"
                  borderRadius="md"
                  overflow="hidden"
                  onClick={() => handleImageClick(items, idx)}
                  _hover={{ opacity: 0.9 }}
                >
                  <GalleryImage
                    src={item.url}
                    width="100%"
                    height="100%"
                    objectFit="cover"
                  />
                </GridItem>
              ))}
            </Grid>
          </Box>
          );
        })}
      </Box>
        <Box sx={{ display: { base: "none", md: "block" } }}>
          <PackageImagesSliderModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            imageUrls={modalImages}
            activeIndex={imageModalActiveIndex}
          />
        </Box>
    </PageLayout>
  );
};
