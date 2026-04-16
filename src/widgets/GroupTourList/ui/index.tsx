"use client"

import { type LayoutProps } from "./types";
import { Box, Flex, Grid, GridItem } from "@chakra-ui/react";
import {
  useGroupToursList,
  useHotelPackagesSearchContext,
  type GroupTourEntity,
} from "@entities/package";

import { EmptyView, EmptyViewWithAfterSearch } from "@widgets/GroupTourList/ui/EmptyView";
import { Skeleton } from "@shared/ui";
import { GroupTourCard } from "./GroupTourCard";
import { useSearchParams } from "@shared/lib/router";
import { getValidDepartures } from "@/widgets/GroupTourDetails/lib/utils";
import { Actions, GroupTourSortType } from "./Actions";
import { useMemo, useState } from "react";

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

const isDepartureMatchesSelectedMonths = (
  startDate: string | undefined,
  endDate: string | undefined,
  selectedMonthKeys: string[],
) => {
  if (selectedMonthKeys.length === 0) return true;

  const startMonthKey = startDate?.slice(0, 7);
  const endMonthKey = endDate?.slice(0, 7);

  return (
    (startMonthKey ? selectedMonthKeys.includes(startMonthKey) : false) ||
    (endMonthKey ? selectedMonthKeys.includes(endMonthKey) : false)
  );
};

const getDepartureToDisplay = (
  groupTour: GroupTourEntity,
  selectedMonthKeys: string[],
) => {
  const validDepartures = getValidDepartures(groupTour.departures ?? []);
  const matchedDeparture = validDepartures.find((departure) =>
    isDepartureMatchesSelectedMonths(
      departure.startDate,
      departure.endDate,
      selectedMonthKeys,
    ),
  );

  return matchedDeparture ?? validDepartures[0];
};

export const GroupTourList = () => {
  const [sortType, setSortType] = useState<GroupTourSortType>(GroupTourSortType.NEWEST);
  const [searchParams] = useSearchParams();
  const { isLoadingFilteredHotelPackages } = useHotelPackagesSearchContext();
  const {
    data: groupToursResponse,
    isLoading: isLoadingGroupTours,
  } = useGroupToursList();

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
        // Match by either boundary month so ranges like May -> June
        // are visible when June is selected.
        return isDepartureMatchesSelectedMonths(
          departure.startDate,
          departure.endDate,
          selectedMonthKeys,
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

  const sortedGroupTours = useMemo(() => {
    const tours = [...filteredGroupTours]

    if (sortType === GroupTourSortType.CHEAPEST) {
      tours.sort((a, b) => (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER))
      return tours
    }

    if (sortType === GroupTourSortType.CLOSEST_DATES) {
      tours.sort((a, b) => {
        const aDate = getDepartureToDisplay(a, selectedMonthKeys)?.startDate
        const bDate = getDepartureToDisplay(b, selectedMonthKeys)?.startDate

        if (!aDate && !bDate) return 0
        if (!aDate) return 1
        if (!bDate) return -1
        return new Date(aDate).getTime() - new Date(bDate).getTime()
      })
      return tours
    }

    // Default sort: newest created tours first.
    tours.sort((a, b) => {
      const aCreatedAt = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const bCreatedAt = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return bCreatedAt - aCreatedAt
    })

    return tours
  }, [filteredGroupTours, sortType, selectedMonthKeys])

  const visibleSortedGroupTours = useMemo(
    () => sortedGroupTours.filter(isGroupTourVisible),
    [sortedGroupTours]
  )

  const isLoading =
    !visibleSortedGroupTours.length &&
    (isLoadingGroupTours || isLoadingFilteredHotelPackages);

  const generateLink = (groupTourId: string) => {
    return `/group-tour/${groupTourId}`;
  };

  if (!isLoading && !visibleSortedGroupTours?.length) {
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

      {!isLoading && visibleSortedGroupTours.length > 0 && (
        <>

          <Actions
            totalTours={visibleSortedGroupTours.length}
            sortType={sortType}
            onSortChange={setSortType}
          />
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
            {visibleSortedGroupTours.map((groupTour) => (
              <GridItem key={groupTour.id} w="100%" h="100%">
                {/*
                  Keep card date aligned with month filter:
                  when multiple valid departures exist, show the first departure
                  matching selected month(s) instead of default first valid departure.
                */}
                {(() => {
                  const matchedDeparture = getDepartureToDisplay(groupTour, selectedMonthKeys);

                  return (
                    <GroupTourCard
                      groupTour={groupTour}
                      matchedDeparture={matchedDeparture}
                      link={generateLink(groupTour.id)}
                    />
                  );
                })()}
              </GridItem>
            ))}
          </Grid>
        </>
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
        direction={"column"}
        align={{ base: "flex-start", md: "initial" }}
      >
        {children}
      </Flex>
    </Box>
  </Box>
);
