import { Box, Flex } from "@chakra-ui/react";
import { Footer } from "@ui";
import {
  PackageImagesGallery,
  PackageImagesSliderModal,
} from "@features/PackageImagesGallery";
import { PackageDetails, PackageDetailsHeader } from "@widgets/PackageDetails";
import { PackageEntity, usePackagesSearchContext } from "@entities/package";
import Loader from "@/components/Loader/Loader.tsx";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBreakpoint } from "@shared/hooks";
import { BookingFlow } from "@widgets/BookingFlow";
import { usePackageDetailsFromStore } from "@/modules/packages/hooks";
import { BookingDrawer } from "@/widgets/HotelBookingDrawer";
import { useBookingDrawer } from "@/modules/packages/hooks/useBookingDrawer";
import { useRecoilState } from "recoil";
import {
  isBookingFlowOpenAtom,
  isLateCheckoutAtom,
} from "@/modules/packages/store/store";
import { PackageDetailsHeader as SharedHeader } from "@/shared/ui/layout/PackageDetailsHeader";
import { PackageDetailsLayout } from "@/shared/ui/layout/PackageDetailsLayout";
import { usePackageImages } from "@/hooks/usePackageImages";
import { metaEvents } from "@/shared/configs/metaEvents";
import { PriceSummaryCard } from "@/shared/ui/PriceSummaryCard";

export const PackageDetailsPage = () => {
  const navigate = useNavigate();
  const { isMd } = useBreakpoint();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isBookingFlowOpen, setBookingFlowOpen] = useRecoilState(
    isBookingFlowOpenAtom,
  );
  const { packageDetails, isFetched, childrenAges } = usePackageDetailsFromStore();

  const { filteredPackages } = usePackagesSearchContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageModalActiveIndex, setImageModalActiveIndex] = useState(0);

  const { uniqueImageUrls } = usePackageImages(packageDetails);
  const { selectedPackage, clearBookingDrawerData } = useBookingDrawer();

  const [isLateCheckout, setIsLateCheckout] =
    useRecoilState(isLateCheckoutAtom);

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

  const handleLogEvent = (index: number) => {
    metaEvents.hotelGalleryOpened({
      hotel_id: packageDetails?.hotel?.id || 0,
      images_viewed: index,
      gallery_time_seconds: 0,
    });
  };

  const handleImageClick = (index: number) => {
    setImageModalActiveIndex(index);
    setModalOpen(true);
    handleLogEvent(index);
  };

  const handleBackClick = () => {
    if (filteredPackages?.length) {
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

  const { isOpen: isOpenBookingDrawer } = useBookingDrawer();

  if (!packageDetails?.offerId) {
    return <Loader loading />;
  }

  const tourPackage = !!selectedPackage ? selectedPackage : packageDetails;

  return (
    <Box overflowX="hidden" mb={{ base: "117px", md: "0" }}>
      <SharedHeader onBackClick={handleBackClick} packageType="package" />

      <PackageImagesGallery
        imageUrls={uniqueImageUrls}
        mt={{ md: 10 }}
        onImageClick={handleImageClick}
      />

      <PackageDetailsLayout>
        <PackageDetailsHeader
          tourPackage={tourPackage}
          onMoreImagesClick={() => {
            handleLogEvent(0);
            setModalOpen(true);
          }}
        />

        <Flex
          direction={{ base: "column-reverse", md: "row" }}
          mt={{ md: "10" }}
          ref={containerRef}
        >
          <PackageDetails
            tourPackage={tourPackage}
            isLateCheckout={isLateCheckout}
          />
          <PriceSummaryCard
            tourPackage={tourPackage}
            ml={{ md: "20" }}
            mt={{ base: "5", md: "0" }}
            flexShrink={0}
            containerRef={containerRef}
            contentType="package"
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
        packageDetails={selectedPackage as PackageEntity}
        initialView="travelers"
        childrenAges={childrenAges}
        // onBookingSuccess={handleBackClick}
        isOpen={isBookingFlowOpen}
        onClose={() => setBookingFlowOpen(false)}
      />
    </Box>
  );
};
