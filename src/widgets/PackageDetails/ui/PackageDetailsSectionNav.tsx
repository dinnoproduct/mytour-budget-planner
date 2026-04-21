import { type RefObject } from "react";
import { StickySectionNav } from "@/shared/ui";
import { useTranslation } from "react-i18next";

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

  return (
    <StickySectionNav
      items={NAV_ITEMS.map(({ id, labelKey }) => ({ id, label: t(labelKey) }))}
      initialActiveId={PACKAGE_DETAILS_SECTION_IDS.included}
      containerRef={containerRef}
      detailsColumnRef={detailsColumnRef}
      desktopOverflowX="auto"
      desktopPaddingBottom={1}
    />
  );
};
