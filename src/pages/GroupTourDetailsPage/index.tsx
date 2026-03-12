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
  const { navigateBack, navigateToHome, navigateToGroupTourGallery } = useLanguageNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [imageModalActiveIndex, setImageModalActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const imageUrls = useMemo(
    () =>
      groupTour?.gallery
        .sort((a, b) => a.order - b.order)
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
      navigateBack();
    }
  }, [isFetched, tourId, groupTour, navigateBack]);

  if (!tourId) {
    return null;
  }

  if (isLoading || !groupTour) {
    return <Loader loading />;
  }

  return (
    <PageLayout
      mb={{ base: "117px", md: "0" }}
      footerProps={{ mt: { base: "100px", md: "0px" } }}
    >
      <SharedHeader onBackClick={handleBackClick} title={t("back")} />

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
