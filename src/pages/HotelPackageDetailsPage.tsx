import { Box, Flex } from "@chakra-ui/react";
import { Footer } from "@ui";
import {
  PackageImagesGallery,
  PackageImagesSliderModal,
} from "@features/PackageImagesGallery";
import {
  type PackageEntity,
  useHotelPackagesSearchContext,
  useSearchHotelPackage,
} from "@entities/package";
import Loader from "@/components/Loader/Loader.tsx";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBreakpoint } from "@shared/hooks";
import { BookingFlow } from "@widgets/BookingFlow";
import {
  HotelPackageDetails,
  HotelPackageDetailsHeader,
} from "@widgets/HotelPackageDetails";
import { HotelPackageBookingConfig } from "@widgets/HotelPackageBookingConfig";
import { BookingDrawer } from "@/widgets/HotelBookingDrawer";
import { useRecoilState } from "recoil";
import {
  isBookingFlowOpenAtom,
  isLateCheckoutAtom,
} from "@/modules/packages/store/store";
import { useBookingDrawer } from "@/modules/packages/hooks/useBookingDrawer";
import { PackageDetailsHeader as SharedHeader } from "@/shared/ui/layout/PackageDetailsHeader";
import { PackageDetailsLayout } from "@/shared/ui/layout/PackageDetailsLayout";
import { usePackageImages } from "@/hooks/usePackageImages";

export const HotelPackageDetailsPage = () => {
  const navigate = useNavigate();
  const { isMd } = useBreakpoint();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isBookingFlowOpen, setBookingFlowOpen] = useRecoilState(
    isBookingFlowOpenAtom,
  );
  const { packageDetails, childrenAges, isFetched } = useSearchHotelPackage();
  const { packageData, clearBookingDrawerData } = useBookingDrawer();

  const { filteredHotelPackages } = useHotelPackagesSearchContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageModalActiveIndex, setImageModalActiveIndex] = useState(0);
  const { isOpen: isOpenBookingDrawer } = useBookingDrawer();
  const [isLateCheckout, setIsLateCheckout] =
    useRecoilState(isLateCheckoutAtom);

  const { uniqueImageUrls } = usePackageImages(packageDetails);

  useEffect(() => {
    return () => {
      clearBookingDrawerData();
      setBookingFlowOpen(false);
      setModalOpen(false);
      setIsLateCheckout(false);
    };
  }, []);

  useEffect(() => {
    if (!packageDetails?.offerId && isFetched) {
      handleBackClick();
    }
  }, [packageDetails?.offerId, isFetched]);

  const handleImageClick = (index: number) => {
    setImageModalActiveIndex(index);
    setModalOpen(true);
  };

  const handleBackClick = () => {
    if (filteredHotelPackages?.length) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    if (!isMd) {
      setModalOpen(false);
    }
  }, [isMd]);

  if (!packageDetails?.offerId) {
    return <Loader loading />;
  }

  const tourPackage = !!packageData ? packageData : packageDetails;

  return (
    <Box overflowX="hidden" mb={{ base: "117px", md: "0" }}>
      <SharedHeader onBackClick={handleBackClick} packageType="hotel" />

      <PackageImagesGallery
        imageUrls={uniqueImageUrls}
        mt={{ md: 10 }}
        onImageClick={handleImageClick}
      />

      <PackageDetailsLayout>
        <HotelPackageDetailsHeader
          tourPackage={tourPackage}
          onMoreImagesClick={() => setModalOpen(true)}
        />

        <Flex
          direction={{ base: "column-reverse", md: "row" }}
          mt={{ md: "10" }}
          ref={containerRef}
        >
          <HotelPackageDetails tourPackage={tourPackage} />

          <HotelPackageBookingConfig
            tourPackage={tourPackage}
            ml={{ md: "20" }}
            mt={{ base: "5", md: "0" }}
            flexShrink={0}
            containerRef={containerRef}
          />
        </Flex>
      </PackageDetailsLayout>

      <Footer />

      <PackageImagesSliderModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        imageUrls={uniqueImageUrls}
        activeIndex={imageModalActiveIndex}
      />

      {isOpenBookingDrawer && <BookingDrawer childrenAges={childrenAges} />}
      <BookingFlow
        packageDetails={packageData as PackageEntity}
        initialView="travelers"
        childrenAges={childrenAges}
        // onBookingSuccess={handleBackClick}
        isOpen={isBookingFlowOpen}
        onClose={() => setBookingFlowOpen(false)}
      />
    </Box>
  );
};
