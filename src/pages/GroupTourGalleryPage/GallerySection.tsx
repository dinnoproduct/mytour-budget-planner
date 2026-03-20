import { Box, Flex, Grid, GridItem } from "@chakra-ui/react"
import { GalleryImage } from "@features/PackageImagesGallery"
import ImagesSlider from "@features/PackageImagesGallery/ui/ImagesSlider.tsx"
import type { GroupTourGalleryItem } from "@entities/package"
import { getLocalized } from "@/widgets/GroupTourDetails/lib/utils"
import React from "react"

interface GallerySectionProps {
  attributeKey: string
  items: GroupTourGalleryItem[]
  languageSuffix: string
  onImageClick: (items: GroupTourGalleryItem[], index: number) => void
  sectionRef: (el: HTMLDivElement | null) => void
}

export const GallerySection = ({
  attributeKey,
  items,
  languageSuffix,
  onImageClick,
  sectionRef,
}: GallerySectionProps) => {
  const localizedAttribute =
    getLocalized(items[0]?.attribute, languageSuffix) || attributeKey

  return (
    <Box ref={sectionRef} mb={6}>
      <Flex
        fontSize="2xl"
        fontWeight="bold"
        color="gray.800"
        mb={4}
        textTransform="capitalize"
      >
        {localizedAttribute}
      </Flex>

      <Box display={{ base: "block", md: "none" }}>
        {items.length > 1 ? (
          <ImagesSlider imageUrls={items.map((item) => item.url)} />
        ) : (
          <GalleryImage
            src={items[0].url}
            width="100%"
            height="288px"
            objectFit="cover"
          />
        )}
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
            onClick={() => onImageClick(items, idx)}
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
  )
}
