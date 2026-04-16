import { Box, Flex } from "@chakra-ui/react"
import { GalleryImage } from "@features/PackageImagesGallery"
import type { GroupTourGalleryItem } from "@entities/package"
import { getLocalized } from "@/widgets/GroupTourDetails/lib/utils"

interface GalleryTabsProps {
  sections: [string, GroupTourGalleryItem[]][]
  languageSuffix: string
  onTabClick: (attribute: string) => void
}

export const GalleryTabs = ({ sections, languageSuffix, onTabClick }: GalleryTabsProps) => (
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
    {sections.map(([attributeKey, items]) => {
      const localizedAttribute =
        getLocalized(items[0]?.attribute, languageSuffix) || attributeKey

      return (
        <Flex
          key={attributeKey}
          direction="column"
          align="flex-start"
          flexShrink={0}
          gap={4}
          cursor="pointer"
          onClick={() => onTabClick(attributeKey)}
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
            fontWeight="medium"
            maxW="100%"
            textTransform="capitalize"
          >
            {localizedAttribute}
          </Box>
        </Flex>
      )
    })}
  </Flex>
)
