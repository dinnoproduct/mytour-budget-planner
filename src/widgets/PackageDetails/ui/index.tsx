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

export const PackageDetails = ({
  tourPackage,
  isLateCheckout,
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

  return (
    <Flex direction="column" mt={{ base: 2, md: 0 }} gap={{ base: "2", md: "6" }}>
      <CardSectionLayout>
        <SectionLayout title={t`included`}>
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

      <CardSectionLayout>
        <SectionLayout
          title={t`flightDetails`}
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

      <CardSectionLayout>
        <SectionLayout
          title={t`hotelDetails`}
          listItems={[
            { key: t`checkIn`, value: formatDate(tourPackage.checkin) },
            { key: t`checkOut`, value: formatDate(tourPackage.checkout) },
            {
              key: t`lateCheckOut`,
              value: isLateCheckout ? t`included` : t`notIncluded`,
            },
          ]}
        />

        <SectionLayout
          mt="8"
          subtitle={t`reviewsAccordingToBooking`}
          listItems={[
            {
              key: t`guestsReviews`,
              value: tourPackage.hotel?.travellersRating,
            },
            { key: t`cleanliness`, value: tourPackage.hotel?.cleanliness },
          ]}
        />

        <PackageDescription tourPackage={tourPackage} />
      </CardSectionLayout>
      <CardSectionLayout>
        <iframe
          width="100%"
          height={"350"}
          style={{ border: 0 }}
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
