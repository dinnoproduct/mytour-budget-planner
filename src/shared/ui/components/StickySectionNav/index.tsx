import { Box, Flex } from "@chakra-ui/react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { useBreakpoint } from "@shared/hooks";
import { Button } from "@components/Button";

const TOP_OFFSET_PX = 80;

export type StickySectionNavItem<T extends string> = {
  id: T;
  label: ReactNode;
};

type StickySectionNavProps<T extends string> = {
  items: StickySectionNavItem<T>[];
  initialActiveId: T;
  containerRef?: RefObject<HTMLDivElement | null>;
  detailsColumnRef?: RefObject<HTMLDivElement | null>;
  desktopOverflowX?: "auto" | "visible";
  desktopPaddingBottom?: number;
};

export const StickySectionNav = <T extends string>({
  items,
  initialActiveId,
  containerRef,
  detailsColumnRef,
  desktopOverflowX = "visible",
  desktopPaddingBottom = 0,
}: StickySectionNavProps<T>) => {
  const { isMd } = useBreakpoint();
  const [isFixed, setIsFixed] = useState(false);
  const [columnLayout, setColumnLayout] = useState({ left: 0, width: 0 });
  const navMeasureRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(0);
  const [activeId, setActiveId] = useState<T>(initialActiveId);

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

  const pickActiveSectionId = useCallback((): T => {
    const navEl = navMeasureRef.current;
    const markerY = navEl
      ? navEl.getBoundingClientRect().bottom + 4
      : TOP_OFFSET_PX + navHeight + 4;

    let current: T = items[0].id;
    for (const { id } of items) {
      const el = document.getElementById(id);
      if (!el) continue;
      if (el.getBoundingClientRect().top <= markerY) {
        current = id;
      }
    }
    return current;
  }, [items, navHeight]);

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
  }, [pickActiveSectionId]);

  const scrollToSection = (id: T) => {
    setActiveId(id);
    const targetSection = document.getElementById(id);
    if (!targetSection) return;

    const navEl = navMeasureRef.current;
    const stickyOffset = isMd
      ? TOP_OFFSET_PX + (navEl?.getBoundingClientRect().height ?? navHeight) + 8
      : TOP_OFFSET_PX + 8;
    const targetTop =
      window.scrollY + targetSection.getBoundingClientRect().top - stickyOffset;

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: "smooth",
    });
  };

  const showFixed = Boolean(isMd && isFixed && columnLayout.width > 0);
  const desktopScrollPaddingBottom =
    desktopOverflowX === "auto" ? 3 : desktopPaddingBottom;

  return (
    <Box
      position={showFixed ? "fixed" : "static"}
      top={
        showFixed ? `${TOP_OFFSET_PX}px` : { base: "72px", md: `${TOP_OFFSET_PX}px` }
      }
      width={showFixed ? `${columnLayout.width}px` : "full"}
      zIndex={11}
      bg="white"
      py={2}
      px={showFixed ? { base: 4, md: 4 } : 0}
      mb={3}
      mx={showFixed ? { base: -4, md: -4 } : 0}
      borderBottom="1px solid"
      borderInline={showFixed ? "1px solid" : "0px solid"}
      borderColor="gray.100"
      borderBottomRadius={showFixed ? "2xl" : "0px"}
    >
      <Flex
        ref={navMeasureRef}
        align="center"
        gap={2}
        flexWrap="nowrap"
        overflowX={{ base: "auto", md: desktopOverflowX }}
        pb={{ base: 2, md: desktopScrollPaddingBottom }}
        width="full"
        sx={{
          // base (mobile): no scrollbar at all
          scrollbarWidth: { base: 'none', md: 'none' },
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': {
            height: { base: 0, md: '6px' },
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'transparent',
            borderRadius: '999px',
          },
          // desktop hover: bring back colors so it becomes visible
          '@media (hover: hover)': {
            '&:hover': {
              scrollbarWidth: 'thin',
              msOverflowStyle: 'auto',
            },
            '&:hover::-webkit-scrollbar-track': {
              backgroundColor: 'gray.200',
            },
            '&:hover::-webkit-scrollbar-thumb': {
              backgroundColor: 'gray.400',
            },
          },
        }}
      >
        {items.map(({ id, label }) => (
          <Button
            key={id}
            width={{ base: "fit-content", md: "full" }}
            minW="fit-content"
            type="button"
            size="sm"
            borderRadius="full"
            px={{ base: 3, md: 4 }}
            sx={{
              border: "1px solid",
              borderColor: activeId === id ? "blue.500" : "gray.300",
              backgroundColor: activeId === id ? "blue.500" : "white",
              color: activeId === id ? "white" : "gray.600",
            }}
            whiteSpace="nowrap"
            variant={activeId === id ? "solid-blue" : "outline-gray"}
            onClick={() => scrollToSection(id)}
            transition="all 0.2s ease-in-out"
          >
            {label}
          </Button>
        ))}
      </Flex>
    </Box>
  );
};
