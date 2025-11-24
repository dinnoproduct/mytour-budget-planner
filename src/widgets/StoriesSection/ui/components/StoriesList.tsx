import { Box, Flex, useMediaQuery } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { type Swiper as SwiperType } from "swiper";
import { type SwiperOptions } from "swiper/types";
import "swiper/css";
import "swiper/css/navigation";
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
      {isMdUp && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height={{ base: 20, md: "108px" }}
        >
          <StoryScrollArrow
            direction="left"
            onClick={() => swiperRef.current?.slidePrev()}
            isDisabled={!hasOverflow}
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
        <Swiper
          modules={[Navigation]}
          loop={hasOverflow}
          speed={400}
          allowTouchMove
          breakpoints={SWIPER_BREAKPOINTS}
          onSwiper={(instance) => {
            swiperRef.current = instance;
          }}
        >
          {storyGroups.map((group) => (
            <SwiperSlide
              key={group.storySet.id}
              style={{
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
      </Box>

      {isMdUp && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height={{ base: 20, md: "100px" }}
        >
          <StoryScrollArrow
            direction="right"
            onClick={() => swiperRef.current?.slideNext()}
            isDisabled={!hasOverflow}
          />
        </Box>
      )}
    </Flex>
  );
};
