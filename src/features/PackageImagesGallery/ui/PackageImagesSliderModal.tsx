import React, { useRef, useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Box,
  Flex,
} from "@chakra-ui/react";
import Slider, { Settings } from "react-slick";
import { GalleryImage } from "./GalleryImage";
import { Button, Text } from "@ui";
import { ButtonProps } from "@components/Button";

interface PackageImagesSliderModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrls: string[];
  activeIndex?: number;
}

export const PackageImagesSliderModal = ({
  isOpen,
  onClose,
  imageUrls,
  activeIndex = 0,
}: PackageImagesSliderModalProps) => {
  const sliderRef = useRef<Slider>(null);
  const [currentSlide, setCurrentSlide] = useState(activeIndex);

  useEffect(() => {
    setCurrentSlide(activeIndex);
  }, [activeIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        sliderRef.current?.slickPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        sliderRef.current?.slickNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const settings: Settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 300,
    initialSlide: activeIndex,
    beforeChange: (current, next) => setCurrentSlide(next),
    arrows: true,
    lazyLoad: "ondemand",
    nextArrow: <ArrowButton isPrev={false} />,
    prevArrow: <ArrowButton isPrev={true} />,
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      isCentered
      autoFocus={false}
    >
      <ModalOverlay />
      <ModalContent
        maxWidth="1183px"
        maxHeight="783px"
        m="24px"
        height="full"
        width="full"
      >
        <ModalHeader p="0">
          <Flex
            borderBottom="1px solid"
            borderColor="gray.100"
            width="full"
            justify="end"
            pt="6"
            px="6"
            pb="4"
          >
            <Button
              icon="close"
              onClick={onClose}
              variant="text-blue"
              size="lg"
            />
          </Flex>
        </ModalHeader>

        <ModalBody p={6} position="relative">
        {imageUrls.length > 1 ? (
          <><Box mx="72px">
            <Slider ref={sliderRef} {...settings}>
              {imageUrls.map((url, index) => (
                <Box
                  key={`package-image-slide-image-${index}`}
                  outline="none"
                  height="615px"
                >
                  <GalleryImage src={url} minHeight="full" />
                </Box>
              ))}
            </Slider>
          </Box>

          <Text align="center" size="sm" fontWeight="semibold" mt=".5">
            {currentSlide + 1}/{imageUrls.length}
          </Text></> ) : (
            <Box mx="72px">
              <GalleryImage src={imageUrls[0]} minHeight="full" />
            </Box>
          )
        }
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const ArrowButton = ({
  isPrev,
  currentSlide: _currentSlide,
  slideCount: _slideCount,
  ...props
}: { isPrev: boolean; currentSlide?: number; slideCount?: number } & ButtonProps) => {
  return (
    <Button
      position="absolute"
      size="lg"
      {...props}
      sx={{
        _before: {
          content: "none",
        },
        height: "48px",
        width: "48px",
        [isPrev ? "left" : "right"]: "-72px",
      }}
      icon={isPrev ? "chevron-left" : "chevron-right"}
    />
  );
};
