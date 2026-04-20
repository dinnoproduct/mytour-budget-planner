import { Box, Flex } from "@chakra-ui/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { Button } from "@/shared/ui";
import { useBreakpoint } from "@shared/hooks";
import { useTranslation } from "react-i18next";

const TOP_OFFSET_PX = 80;

export const PACKAGE_DETAILS_SECTION_IDS = {
  included: "package-details-included",
  flight: "package-details-flight",
  hotel: "package-details-hotel",
  ratings: "package-details-ratings",
  map: "package-details-map",
} as const;

type PackageDetailsSectionId =
  (typeof PACKAGE_DETAILS_SECTION_IDS)[keyof typeof PACKAGE_DETAILS_SECTION_IDS];

const NAV_ITEMS: { id: PackageDetailsSectionId; labelKey: string }[] = [
  { id: PACKAGE_DETAILS_SECTION_IDS.included, labelKey: "included" },
  { id: PACKAGE_DETAILS_SECTION_IDS.flight, labelKey: "flightDetails" },
  { id: PACKAGE_DETAILS_SECTION_IDS.hotel, labelKey: "hotelDetails" },
  { id: PACKAGE_DETAILS_SECTION_IDS.ratings, labelKey: "grades" },
  { id: PACKAGE_DETAILS_SECTION_IDS.map, labelKey: "packageDetailsNavMap" },
];

type PackageDetailsSectionNavProps = {
  containerRef?: RefObject<HTMLDivElement | null>;
  detailsColumnRef?: RefObject<HTMLDivElement | null>;
};

export const PackageDetailsSectionNav = ({
  containerRef,
  detailsColumnRef,
}: PackageDetailsSectionNavProps) => {
  const { t } = useTranslation();
  const { isMd } = useBreakpoint();
  const [isFixed, setIsFixed] = useState(false);
  const [columnLayout, setColumnLayout] = useState({ left: 0, width: 0 });
  const navMeasureRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(0);
  const [activeId, setActiveId] = useState<PackageDetailsSectionId>(
    PACKAGE_DETAILS_SECTION_IDS.included,
  );

  const updateColumnLayout = useCallback(() => {
    if (!detailsColumnRef?.current) return;
    const rect = detailsColumnRef.current.getBoundingClientRect();
    setColumnLayout({ left: rect.left, width: rect.width });
  }, [detailsColumnRef]);

  useLayoutEffect(() => {
    const el = navMeasureRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setNavHeight(el.getBoundingClientRect().height);
    });
    ro.observe(el);
    setNavHeight(el.getBoundingClientRect().height);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!isMd) {
      setIsFixed(false);
      return;
    }

    const handleScroll = () => {
      if (!containerRef?.current) return;
      const layoutTop = containerRef.current.getBoundingClientRect().top;
      if (layoutTop <= TOP_OFFSET_PX) {
        if (detailsColumnRef?.current) {
          const rect = detailsColumnRef.current.getBoundingClientRect();
          setColumnLayout({ left: rect.left, width: rect.width });
        }
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMd, containerRef, detailsColumnRef]);

  useLayoutEffect(() => {
    if (!isFixed || !isMd) return;
    updateColumnLayout();
    window.addEventListener("resize", updateColumnLayout);
    return () => window.removeEventListener("resize", updateColumnLayout);
  }, [isFixed, isMd, updateColumnLayout]);

  useEffect(() => {
    const onScroll = () => {
      if (isFixed && isMd) updateColumnLayout();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isFixed, isMd, updateColumnLayout]);

  const pickActiveSectionId = useCallback((): PackageDetailsSectionId => {
    const navEl = navMeasureRef.current;
    const markerY = navEl
      ? navEl.getBoundingClientRect().bottom + 4
      : TOP_OFFSET_PX + navHeight + 4;

    let current: PackageDetailsSectionId = NAV_ITEMS[0].id;
    for (const { id } of NAV_ITEMS) {
      const el = document.getElementById(id);
      if (!el) continue;
      if (el.getBoundingClientRect().top <= markerY) {
        current = id;
      }
    }
    return current;
  }, [navHeight]);

  useEffect(() => {
    const syncActiveFromScroll = () => {
      setActiveId((prev) => {
        const next = pickActiveSectionId();
        return next === prev ? prev : next;
      });
    };

    window.addEventListener("scroll", syncActiveFromScroll, { passive: true });
    window.addEventListener("resize", syncActiveFromScroll);
    syncActiveFromScroll();
    return () => {
      window.removeEventListener("scroll", syncActiveFromScroll);
      window.removeEventListener("resize", syncActiveFromScroll);
    };
  }, [pickActiveSectionId, isFixed, isMd]);

  const scrollToSection = (id: PackageDetailsSectionId) => {
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const showFixed = Boolean(isMd && isFixed && columnLayout.width > 0);

  return (
    <Box
      position={showFixed ? "fixed" : "static"}
      top={
        showFixed
          ? `${TOP_OFFSET_PX}px`
          : { base: "72px", md: `${TOP_OFFSET_PX}px` }
      }
      width={showFixed ? `${columnLayout.width}px` : `full`}
      zIndex={11}
      bg="white"
      py={2}
      px={showFixed ? { base: 4, md: 4 } : 0}
      mb={3}
      mx={showFixed ? { base: -4, md: -4 } : 0}
      borderBottom="1px solid"
      borderInline={showFixed ? `1px solid` : "0px solid"}
      borderColor="gray.100"
      borderBottomRadius={showFixed ? "2xl" : "0px"}
    >
      <Flex
        ref={navMeasureRef}
        align="center"
        gap={2}
        flexWrap="nowrap"
        overflowX={{ base: "auto", md: "auto" }}
        pb={{ base: 1, md: 1 }}
        width="full"
      >
        {NAV_ITEMS.map(({ id, labelKey }) => (
          <Button
            key={id}
            width={{ base: "fit-content", md: "full" }}
            minW="fit-content"
            type="button"
            size="sm"
            borderRadius="full"
            px={{ base: 3, md: 4 }}
            whiteSpace="nowrap"
            variant={activeId === id ? "solid-blue" : "solid-gray"}
            onClick={() => scrollToSection(id)}
            transition="all 0.2s ease-in-out"
          >
            {t(labelKey)}
          </Button>
        ))}
      </Flex>
    </Box>
  );
};
