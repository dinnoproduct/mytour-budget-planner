import { type LayoutProps } from "./types";
import { Box, Flex, Grid, GridItem } from "@chakra-ui/react";
import {
  useGroupToursList,
  useHotelPackagesSearchContext,
  type GroupTourEntity,
} from "@entities/package";

import { EmptyView, EmptyViewWithAfterSearch } from "@widgets/GroupTourList/ui/EmptyView.tsx";
import { Skeleton } from "@shared/ui";
import { GroupTourCard } from "./GroupTourCard";
import { useSearchParams } from "react-router-dom";
import { getValidDepartures } from "@/widgets/GroupTourDetails/lib/utils";

const MONTH_INDEX_BY_KEY: Record<string, number> = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11
}

const isGroupTourVisible = (groupTour: GroupTourEntity): boolean => {
  if (groupTour?.status?.toLowerCase() !== "active") return false;

  const departures = groupTour.departures ?? [];
  if (!departures.length) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const hasValidDeparture = departures.some((departure) => {
    if (departure.availableSeats <= 0) return false;

    if (departure.bookingDeadline) {
      const deadline = new Date(departure.bookingDeadline);
      return deadline > today;
    }

    if (departure.startDate) {
      const start = new Date(departure.startDate);
      start.setHours(0, 0, 0, 0);
      return start > today;
    }

    return false;
  });

  return hasValidDeparture;
};

export const GroupTourList = () => {
  const [searchParams] = useSearchParams();
  const { isLoadingFilteredHotelPackages } = useHotelPackagesSearchContext();
  const {
    data: groupToursResponse,
    isLoading: isLoadingGroupTours,
  } = useGroupToursList({ page: null, limit: null });

  const groupTours = groupToursResponse?.data ?? [];
  const selectedMonthKeys = (searchParams.get("groupTourMonths") || "")
    .split(",")
    .map(item => item.trim())
    .filter(Boolean)
    .map(item => {
      const [yearRaw, monthRaw] = item.split("-")
      const year = Number(yearRaw)
      if (!Number.isFinite(year)) {
        return null
      }

      const numericMonth = Number(monthRaw)
      if (Number.isFinite(numericMonth) && numericMonth >= 1 && numericMonth <= 12) {
        return `${year}-${String(numericMonth).padStart(2, "0")}`
      }

      // Backward compatibility for old format: YYYY-monthName
      const monthIndex = MONTH_INDEX_BY_KEY[monthRaw?.toLowerCase() || ""]
      if (monthIndex === undefined) {
        return null
      }
      return `${year}-${String(monthIndex + 1).padStart(2, "0")}`
    })
    .filter((item): item is string => item !== null);
  const selectedRouteCountries = (searchParams.get("groupTourRouteCountries") || "")
    .split(",")
    .map(item => item.trim().toLowerCase())
    .filter(Boolean);

  const filteredGroupTours = groupTours.filter(groupTour => {
    const validDepartures = getValidDepartures(groupTour.departures ?? []);
    const isMonthMatch =
      selectedMonthKeys.length === 0 ||
      (validDepartures ?? []).some(departure => {
        const startMonthKey = departure.startDate?.slice(0, 7)
        const endMonthKey = departure.endDate?.slice(0, 7)

        // Match by either boundary month so ranges like May -> June
        // are visible when June is selected.
        return (
          (startMonthKey ? selectedMonthKeys.includes(startMonthKey) : false) ||
          (endMonthKey ? selectedMonthKeys.includes(endMonthKey) : false)
        )
      })

    const routeCountryValues = (groupTour.routeCountries ?? [])
      .flatMap(country => [country.arm, country.eng, country.rus])
      .map(item => item?.trim().toLowerCase())
      .filter(Boolean)
    const isDestinationMatch =
      selectedRouteCountries.length === 0 ||
      selectedRouteCountries.some(item => routeCountryValues.includes(item))

    return isMonthMatch && isDestinationMatch
  });

  const isLoading =
    !filteredGroupTours.length &&
    (isLoadingGroupTours || isLoadingFilteredHotelPackages);

  const generateLink = (groupTourId: string) => {
    return `/group-tour/${groupTourId}`;
  };

  if (!isLoading && !filteredGroupTours?.length) {
    return selectedRouteCountries.length > 0 || selectedMonthKeys.length > 0 ? <EmptyViewWithAfterSearch /> : <EmptyView />;
  }

  return (
    <Layout>
      {isLoading && (
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          rowGap={{ base: 6, md: 10 }}
          columnGap={6}
          justifyItems="center"
          w="100%"
        >
          <SkeletonLoading />
        </Grid>
      )}

      {!isLoading && filteredGroupTours.length > 0 && (
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          rowGap={{ base: 6, md: 10 }}
          columnGap={6}
          justifyItems="stretch"
          alignItems="stretch"
          autoRows="1fr"
          w="100%"
        >
          {filteredGroupTours.map((groupTour) =>
            isGroupTourVisible(groupTour) ? (
              <GridItem key={groupTour.id} w="100%" h="100%">
                <GroupTourCard
                  groupTour={groupTour}
                  link={generateLink(groupTour.id)}
                />
              </GridItem>
            ) : null,
          )}
        </Grid>
      )}
    </Layout>
  );
};

const SkeletonLoading = ({ carsCount = 8 }) =>
  Array(carsCount)
    .fill(1)
    .map((_data, index) => (
      <GridItem
        key={`group-tour-card-skeleton-${index}`}
        width="100%"
        height="380px"
      >
        <Skeleton width="100%" height="100%" rounded="2xl" />
      </GridItem>
    ));

const Layout = ({ children }: LayoutProps) => (
  <Box pt={{ base: 0, md: 5 }} pb={{ base: 16, md: 24 }} width="100%">
    <Box px={{ base: 4, md: 10 }}>
      <Flex
        gap={6}
        direction={{ base: "column", md: "row" }}
        align={{ base: "flex-start", md: "initial" }}
      >
        {children}
      </Flex>
    </Box>
  </Box>
);
