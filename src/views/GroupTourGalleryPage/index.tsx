"use client"

import { Box, Flex } from "@chakra-ui/react"
import { useParams } from "@shared/lib/router"
import { useRef, useState, useMemo } from "react"
import { Loader } from "@/components/Loader/Loader"
import { useGroupTourInfo } from "@entities/package"
import { useLanguageNavigate } from "@/hooks/useLanguageNavigate"
import { PackageDetailsHeader as SharedHeader } from "@/shared/ui/layout/PackageDetailsHeader"
import { PageLayout } from "@/shared/ui/layout/PageLayout"
import { PackageImagesSliderModal } from "@features/PackageImagesGallery"
import { useTranslation } from "react-i18next"
import type { GroupTourGalleryItem } from "@entities/package"
import { LANGUAGE_PREFIX, type LanguageName } from "@shared/model"
import { groupGalleryByAttribute } from "./utils"
import { GalleryTabs } from "./GalleryTabs"
import { GallerySection } from "./GallerySection"

export const GroupTourGalleryPage = () => {
  const { id: tourId } = useParams<{ id: string }>()
  const { data: groupTour, isLoading } = useGroupTourInfo(tourId)
  const { navigateBack } = useLanguageNavigate()
  const { t, i18n } = useTranslation()
  const [isModalOpen, setModalOpen] = useState(false)
  const [imageModalActiveIndex, setImageModalActiveIndex] = useState(0)
  const [modalImages, setModalImages] = useState<string[]>([])
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const languageSuffix = useMemo(
    () => (LANGUAGE_PREFIX[i18n.language as LanguageName] ?? "eng").toLowerCase(),
    [i18n.language],
  )

  const groupedSections = useMemo(
    () => (groupTour?.gallery ? groupGalleryByAttribute(groupTour.gallery) : []),
    [groupTour?.gallery],
  )

  const handleTabClick = (attribute: string) => {
    const el = sectionRefs.current.get(attribute)
    if (!el) return
    const rect = el.getBoundingClientRect()
    const scrollTop = window.scrollY + rect.top - 100
    window.scrollTo({ top: scrollTop, behavior: "smooth" })
  }

  const handleImageClick = (items: GroupTourGalleryItem[], index: number) => {
    const imagesOnly = items.filter(
      (item) => (item.type ?? "").toLowerCase() === "image" || !item.type,
    )
    setModalImages(imagesOnly.map((item) => item.url))
    setImageModalActiveIndex(index)
    setModalOpen(true)
  }

  if (!tourId) return null
  if (isLoading || !groupTour) return <Loader loading />

  return (
    <PageLayout
      mb={{ base: "117px", md: "0" }}
      footerProps={{ mt: { base: "100px", md: "0px" } }}
    >
      <SharedHeader onBackClick={() => navigateBack()} title={t("back")} />

      <Box
        maxW="1188px"
        mx={{ base: 0, md: "auto" }}
        px={{ base: 4, md: 6 }}
        py={{ base: 4, md: 8 }}
      >
        <Flex fontSize="2xl" fontWeight="bold" color="gray.800" mb={4}>
          {t("photos")}
        </Flex>

        <GalleryTabs
          sections={groupedSections}
          languageSuffix={languageSuffix}
          onTabClick={handleTabClick}
        />

        {groupedSections.map(([attributeKey, items]) => (
          <GallerySection
            key={attributeKey}
            attributeKey={attributeKey}
            items={items}
            languageSuffix={languageSuffix}
            onImageClick={handleImageClick}
            sectionRef={(el) => {
              if (el) sectionRefs.current.set(attributeKey, el)
            }}
          />
        ))}
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
  )
}
