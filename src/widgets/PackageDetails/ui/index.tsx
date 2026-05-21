import { type PackageDetailsProps } from "./types";
import { Flex, Grid } from "@chakra-ui/react";
import { SectionLayout } from "@widgets/PackageDetails/ui/SectionLayout";
import { SummaryCard } from "@widgets/PackageDetails/ui/SummaryCard";
import { formatDate } from "@widgets/PackageDetails/utils";
import { useTranslation } from "react-i18next";
import { PackageDescription } from "@widgets/PackageDetails/ui/PackageDescription";
import { type DictionaryTypes, useDictionary } from "@entities/package";
import { useMemo } from "react";
import { CardSectionLayout } from "@/shared/ui/layout/CardSectionLayout";
import { GuestReviews } from "@widgets/GuestReviews";
import {
  PackageDetailsSectionNav,
  PACKAGE_DETAILS_SECTION_IDS,
} from "./PackageDetailsSectionNav";

export const PackageDetails = ({
  tourPackage,
  isLateCheckout,
  containerRef,
  detailsColumnRef,
}: PackageDetailsProps) => {
  const { t } = useTranslation();

  const { data: ticketClasses = [] } = useDictionary(
    "TicketClassDictionary" as DictionaryTypes.TicketClassDictionary,
  );
  const { data: foodTypes = [] } = useDictionary(
    "FoodTypeDictionary" as DictionaryTypes.FoodTypeDictionary,
  );

  const foodType = useMemo<string>(
    () =>
      foodTypes.find(({ key }) => key === tourPackage.foodType)?.value || "",
    [JSON.stringify(foodTypes)],
  );

  const ticketClass = useMemo<string>(
    () =>
      ticketClasses.find(
        ({ key }) => key === tourPackage.destinationFlight.ticketClass,
      )?.value || "",
    [ticketClasses, tourPackage.destinationFlight.ticketClass],
  );

  const sectionScrollMargin = { base: "96px", md: "120px" } as const;

  return (
    <Flex direction="column" mt={{ base: 2, md: 0 }} gap={{ base: "4", md: "6" }}>
      <CardSectionLayout
        id={PACKAGE_DETAILS_SECTION_IDS.included}
        scrollMarginTop={sectionScrollMargin}
        padding={0}
        beforeTitle={
          <PackageDetailsSectionNav
            containerRef={containerRef}
            detailsColumnRef={detailsColumnRef}
          />
        }
        title={t`included`}
      >
        <SectionLayout >
          <Grid
            templateColumns={{
              base: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(4, minmax(0, auto))",
            }}
            columnGap="26px"
            rowGap="4"
          >
            {tourPackage.hotel.id ? (
              <SummaryCard iconName="bed" children={t`hotel`} />
            ) : null}
            {tourPackage.destinationFlight.id && tourPackage.returnFlight.id ? (
              <SummaryCard
                iconName="airplanemode-active"
                children={t`airTicket`}
              />
            ) : null}
            {tourPackage.foodType ? (
              <SummaryCard iconName="restaurant" children={foodType} />
            ) : null}
            {tourPackage.transferType ? (
              <SummaryCard
                iconName="directions-car"
                children={t`transportation`}
              />
            ) : null}
          </Grid>
        </SectionLayout>
      </CardSectionLayout>

      <CardSectionLayout
        id={PACKAGE_DETAILS_SECTION_IDS.flight}
        scrollMarginTop={sectionScrollMargin}
        title={t`flightDetails`}
      >
        <SectionLayout
          listItems={[
            {
              key: t`airCompany`,
              value: tourPackage.destinationFlight.airCompany.name,
            },
            { key: t`class`, value: ticketClass },
            {
              key: t`departure`,
              value: formatDate(tourPackage.destinationFlight.departureDate),
            },
            {
              key: t`returning`,
              value: formatDate(tourPackage.returnFlight.departureDate),
            },
            { key: t`carryOnBag`, value: "1 x 5" + t`kg` },
            { key: t`checkedInBag`, value: "1 x 20" + t`kg` },
          ]}
        />
      </CardSectionLayout>

      <CardSectionLayout
        id={PACKAGE_DETAILS_SECTION_IDS.hotel}
        scrollMarginTop={sectionScrollMargin}
        title={t`hotelDetails`}
      >
        <SectionLayout
          listItems={[
            { key: t`checkIn`, value: formatDate(tourPackage.checkin) },
            { key: t`checkOut`, value: formatDate(tourPackage.checkout) },
            {
              key: t`lateCheckOut`,
              value: isLateCheckout ? t`included` : t`notIncluded`,
            },
          ]}
        />
        <PackageDescription tourPackage={tourPackage} />
      </CardSectionLayout>
      <CardSectionLayout
        id={PACKAGE_DETAILS_SECTION_IDS.ratings}
        scrollMarginTop={sectionScrollMargin}
        title={t`grades`}
      >
        <GuestReviews
          travellersRating={tourPackage.hotel?.travellersRating}
          cleanliness={tourPackage.hotel?.cleanliness}
        />
      </CardSectionLayout>
      <CardSectionLayout
        id={PACKAGE_DETAILS_SECTION_IDS.map}
        scrollMarginTop={sectionScrollMargin}
      >
        <iframe
          width="100%"
          height={"350"}
          style={{ border: 0, borderRadius: '12px', overflow: 'hidden' }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
              &q=${encodeURIComponent(`${tourPackage.hotel?.name}, ${tourPackage.city.nameEng}, ${tourPackage.city.country.nameEng}`)}`}
        />
      </CardSectionLayout>
    </Flex>
  );
};

export { PackageDetailsHeader } from "./PackageDetailsHeader";
