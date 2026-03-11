import { Box, Flex } from "@chakra-ui/react";
import {
  PackageImagesGallery,
  PackageImagesSliderModal,
} from "@features/PackageImagesGallery";
import { PackageDetails, PackageDetailsHeader } from "@widgets/PackageDetails";
import { usePackagesSearchContext } from "@entities/package";
import {Loader} from "@/components/Loader/Loader.tsx";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguageNavigate } from "../hooks/useLanguageNavigate";
import { useBreakpoint } from "@shared/hooks";
import { BookingDrawer } from "@shared/ui";
import { useBookingDrawer } from "@/modules/packages/hooks/useBookingDrawer";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  bookingContextAtom,
  isLateCheckoutAtom,
} from "@/modules/packages/store/store";
import { PackageDetailsHeader as SharedHeader } from "@/shared/ui/layout/PackageDetailsHeader";
import { PackageDetailsLayout } from "@/shared/ui/layout/PackageDetailsLayout";
import { usePackageImages } from "@/hooks/usePackageImages";
import { metaEvents } from "@/shared/configs/metaEvents";
import { PriceSummaryCard } from "@/shared/ui/PriceSummaryCard";
import { usePackage } from "@/entities/package/hooks/usePackage";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { appendStoredUTMsToSearchParams } from "@/utils/utmParams";

export const PackageDetailsPage = () => {
  const { navigateBack, navigateToHome } = useLanguageNavigate();
  const { isMd } = useBreakpoint();
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const setBookingContext = useSetRecoilState(bookingContextAtom);
  const {
    packageDetails,
    isFetched,
    childrenAges,
    generatedMultivendorOffers,
    mealPlans,
    loading,
  } = usePackage();

  const { filteredPackages } = usePackagesSearchContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageModalActiveIndex, setImageModalActiveIndex] = useState(0);

  const { uniqueImageUrls } = usePackageImages(packageDetails);
  const { clearBookingDrawerData } = useBookingDrawer();

  const [isLateCheckout, setIsLateCheckout] =
    useRecoilState(isLateCheckoutAtom);

  useEffect(() => {
    return () => {
      clearBookingDrawerData();
      setModalOpen(false);
      // Do not reset isLateCheckout here: when user navigates to booking it must persist for PreviewDetailsView
    };
  }, []);

  useEffect(() => {
    if (packageDetails?.offerId && childrenAges) {
      setBookingContext({
        packageDetails,
        childrenAges,
        initialView: 'travelers',
      });
    }
  }, [packageDetails?.offerId, childrenAges, setBookingContext]);

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
      navigateBack();
    } else {
      navigateToHome({ replace: true });
    }
  };

  useEffect(() => {
    if (!isMd) {
      setModalOpen(false);
    }
  }, [isMd]);

  // Clean URL if childrenCount is 0 but childrenAges is not empty
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const childrenCountParam = searchParams.get('childrenCount');
    const childrenAgesParam = searchParams.get('childrenAges');
    
    const childrenCount = parseInt(childrenCountParam || '0', 10);
    const hasChildrenAges = childrenAgesParam && childrenAgesParam.trim() !== '';
    
    // If childrenCount is 0 but childrenAges exists and is not empty, set it to empty string
    if (childrenCount === 0 && hasChildrenAges) {
      searchParams.set('childrenAges', '');
      appendStoredUTMsToSearchParams(searchParams);
      const newUrl = `${location.pathname}?${searchParams.toString()}`;
      navigate(newUrl, { replace: true });
    }
  }, [location.search, navigate]);

  const { isOpen: isOpenBookingDrawer } = useBookingDrawer();

  if (!packageDetails?.offerId) {
    return <Loader loading />;
  }

  return (
    <PageLayout 
      mb={{ base: "117px", md: "0" }}
      footerProps={{ mt: { base: "100px", md: "0px" } }}
    >
      <SharedHeader onBackClick={handleBackClick} packageType="package" />

      <PackageImagesGallery
        imageUrls={uniqueImageUrls}
        mt={{ md: 10 }}
        onImageClick={handleImageClick}
      />

      <PackageDetailsLayout>
        <PackageDetailsHeader
          tourPackage={packageDetails}
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
            tourPackage={packageDetails}
            isLateCheckout={isLateCheckout}
          />
          <PriceSummaryCard
            tourPackage={packageDetails}
            ml={{ md: "20" }}
            mt={{ base: "5", md: "0" }}
            flexShrink={0}
            containerRef={containerRef}
            contentType="package"
          />
        </Flex>
      </PackageDetailsLayout>

      <PackageImagesSliderModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        imageUrls={uniqueImageUrls}
        activeIndex={imageModalActiveIndex}
      />
      {isOpenBookingDrawer && (
        <BookingDrawer
          childrenAges={childrenAges}
          generatedMultivendorOffers={generatedMultivendorOffers}
          mealPlans={mealPlans}
          loading={loading}
        />
      )}
    </PageLayout>
  );
};
