import { type RefObject } from "react";
import { useTranslation } from "react-i18next";
import { StickySectionNav } from "@/shared/ui";

export const HOTEL_DETAILS_SECTION_IDS = {
  overview: "hotel-details-overview",
  amenities: "hotel-details-amenities",
  ratings: "hotel-details-ratings",
  map: "hotel-details-map",
} as const;

export type HotelDetailsSectionId =
  (typeof HOTEL_DETAILS_SECTION_IDS)[keyof typeof HOTEL_DETAILS_SECTION_IDS];

const NAV_ITEMS: { id: HotelDetailsSectionId; labelKey: string }[] = [
  {
    id: HOTEL_DETAILS_SECTION_IDS.overview,
    labelKey: "hotelDetailsNavGeneral",
  },
  {
    id: HOTEL_DETAILS_SECTION_IDS.amenities,
    labelKey: "hotelDetailsNavAmenities",
  },
  { id: HOTEL_DETAILS_SECTION_IDS.ratings, labelKey: "grades" },
  { id: HOTEL_DETAILS_SECTION_IDS.map, labelKey: "hotelDetailsNavMap" },
];

export type HotelDetailsSectionNavProps = {
  containerRef?: RefObject<HTMLDivElement | null>;
  detailsColumnRef?: RefObject<HTMLDivElement | null>;
};

export const HotelDetailsSectionNav = ({
  containerRef,
  detailsColumnRef,
}: HotelDetailsSectionNavProps) => {
  const { t } = useTranslation();
  return (
    <StickySectionNav
      items={NAV_ITEMS.map(({ id, labelKey }) => ({ id, label: t(labelKey) }))}
      initialActiveId={HOTEL_DETAILS_SECTION_IDS.overview}
      containerRef={containerRef}
      detailsColumnRef={detailsColumnRef}
    />
  );
};
