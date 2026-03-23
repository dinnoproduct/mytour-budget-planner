import { Flex } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState, useRef } from "react";
import {Loader} from "@/components/Loader/Loader";
import { useGroupTourInfo } from "@entities/package";
import { useLanguageNavigate } from "@/hooks/useLanguageNavigate";
import { PackageDetailsHeader as SharedHeader } from "@/shared/ui/layout/PackageDetailsHeader";
import { PackageDetailsLayout } from "@/shared/ui/layout/PackageDetailsLayout";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import {
  PackageImagesGallery,
  PackageImagesSliderModal,
} from "@features/PackageImagesGallery";
import {
  GroupTourDetails,
  GroupTourDetailsHeader,
  GroupTourBookingCard,
} from "@/widgets/GroupTourDetails";
import { t } from "i18next";

export const GroupTourDetailsPage = () => {
  const { id: tourId } = useParams<{ id: string }>();
  const { data: groupTour, isLoading, isFetched } = useGroupTourInfo(tourId);
  const { navigateBack, navigateToHome, navigateToGroupTourGallery, navigateTo } = useLanguageNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [imageModalActiveIndex, setImageModalActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const imageUrls = useMemo(
    () =>
      groupTour?.gallery
        .sort((a, b) => {
          if (a.isMain === b.isMain) return a.order - b.order;
          return a.isMain ? -1 : 1;
        })
        .map((item) => item.url) ?? [],
    [groupTour?.gallery]
  );

  const handleBackClick = () => {
    navigateBack();
  };

  useEffect(() => {
    if (isFetched && !tourId) {
      navigateToHome({ replace: true });
    }
  }, [isFetched, tourId, navigateToHome]);

  useEffect(() => {
    if (isFetched && tourId && !groupTour) {
      // If tour cannot be fetched (e.g. 404), go to home with Group Tours tab selected
      navigateTo('/?tab=group-tours', { replace: true });
      return;
    }

    if (
      isFetched &&
      tourId &&
      groupTour &&
      (!Array.isArray(groupTour.roomTypes) || groupTour.roomTypes.length === 0)
    ) {
      navigateTo('/?tab=group-tours', { replace: true });
    }
  }, [isFetched, tourId, groupTour, navigateTo]);

  if (!tourId) {
    return null;
  }

  if (isLoading || !groupTour) {
    return <Loader loading />;
  }

  return (
    <PageLayout
    footerProps={{ mt: 0 }}
    >
      {/* <SharedHeader onBackClick={handleBackClick} title={t("homePage")} /> */}
      <PackageImagesGallery
        imageUrls={imageUrls}
        mt={{ md: 10 }}
        onImageClick={(index) => {
          setImageModalActiveIndex(index);
          setModalOpen(true);
        }}
        isGroupTour
      />

      <PackageDetailsLayout>
        <GroupTourDetailsHeader
          groupTour={groupTour}
          onMoreImagesClick={() => {
            setImageModalActiveIndex(0);
            setModalOpen(true);
          }}
        />

        <Flex
          direction={{ base: "column-reverse", md: "row" }}
          mt={{ md: "10" }}
          ref={containerRef}
        >
          <GroupTourDetails groupTour={groupTour} />
          <GroupTourBookingCard groupTour={groupTour} containerRef={containerRef} />
        </Flex>
      </PackageDetailsLayout>

      <PackageImagesSliderModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        imageUrls={imageUrls}
        activeIndex={imageModalActiveIndex}
      />
    </PageLayout>
  );
};
