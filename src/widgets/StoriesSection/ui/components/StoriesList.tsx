import { Box, Flex, useMediaQuery } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import { type Swiper as SwiperType } from "swiper";
import { type SwiperOptions } from "swiper/types";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import { type StoryGroup } from "../types";
import { StoryItem } from "./StoryItem";
import { StoryScrollArrow } from "./StoryScrollArrow";

const SWIPER_BREAKPOINTS: SwiperOptions["breakpoints"] = {
  0: {
    slidesPerView: "auto",
    spaceBetween: 24,
    slidesOffsetBefore: 16,
  },
  768: {
    slidesPerView: "auto",
    spaceBetween: 40,
    slidesOffsetBefore: 0,
  },
  1024: {
    slidesPerView: "auto",
    spaceBetween: 40,
  },
};

interface StoriesListProps {
  storyGroups: StoryGroup[];
  onOpenStorySet: (storySetId: number) => void;
  isHotel?: number;
}

export const StoriesList: React.FC<StoriesListProps> = ({
  storyGroups,
  onOpenStorySet,
  isHotel = 0,
}) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prevWidthRef = useRef(0);

  const [isMdUp] = useMediaQuery("(min-width: 48em)");
  const [containerWidth, setContainerWidth] = useState(0);

  const slideWidth = isMdUp ? 100 : 80;
  const spacing = isMdUp ? 40 : 24;

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const element = containerRef.current;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      const nextWidth = entry.contentRect.width;

      if (nextWidth !== prevWidthRef.current) {
        prevWidthRef.current = nextWidth;
        setContainerWidth(nextWidth);
      }
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  const slidesTotalWidth = storyGroups.length * (slideWidth + spacing);
  const hasMeasuredWidth = containerWidth > 0;
  const computedOverflow = slidesTotalWidth > containerWidth;
  const hasOverflow = hasMeasuredWidth ? computedOverflow : true;

  return (
    <Flex gap={{ base: 2, xs: 3, md: 4 }} align="flex-start">
      {isMdUp && hasOverflow && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height={{ base: 20, md: "108px" }}
        >
          <StoryScrollArrow
            direction="left"
            onClick={() => swiperRef.current?.slidePrev()}
          />
        </Box>
      )}

      <Box
        ref={containerRef}
        flex={1}
        px={{ base: 0, md: 2 }}
        py={2}
        overflow="hidden"
      >
        {hasOverflow ? (
          <Swiper
            modules={[Navigation, FreeMode]}
            loop={hasOverflow}
            speed={250}
            allowTouchMove
            freeMode={{
              enabled: true,
              sticky: false,
              momentum: true,
              momentumBounce: false,
              momentumRatio: 0.5,
              momentumVelocityRatio: 0.5,
            }}
            grabCursor={true}
            resistance={true}
            resistanceRatio={0.5}
            touchRatio={1.5}
            touchAngle={45}
            threshold={5}
            longSwipesRatio={0.5}
            longSwipesMs={300}
            breakpoints={SWIPER_BREAKPOINTS}
            onSwiper={(instance) => {
              swiperRef.current = instance;
            }}
          >
            {storyGroups.map((group) => (
              <SwiperSlide
                key={group.storySet.id}
                
                style={{
                  zIndex: 0,
                  width: `${slideWidth}px`,
                  maxWidth: `${slideWidth}px`,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <StoryItem
                  group={group}
                  onOpen={onOpenStorySet}
                  isHotel={isHotel}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <Flex
            justifyContent="space-between"
            alignItems="flex-start"
            width="100%"
          >
            {storyGroups.map((group) => (
              <Box
                key={group.storySet.id}
                width={`${slideWidth}px`}
                maxWidth={`${slideWidth}px`}
                display="flex"
                justifyContent="center"
                flexShrink={0}
              >
                <StoryItem
                  group={group}
                  onOpen={onOpenStorySet}
                  isHotel={isHotel}
                />
              </Box>
            ))}
          </Flex>
        )}
      </Box>

      {isMdUp && hasOverflow && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height={{ base: 20, md: "100px" }}
        >
          <StoryScrollArrow
            direction="right"
            onClick={() => swiperRef.current?.slideNext()}
          />
        </Box>
      )}
    </Flex>
  );
};
