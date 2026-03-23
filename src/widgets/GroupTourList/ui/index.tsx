import { type LayoutProps } from "./types";
import { Box, Flex, Grid, GridItem } from "@chakra-ui/react";
import {
  useGroupToursList,
  useHotelPackagesSearchContext,
  type GroupTourEntity,
} from "@entities/package";

import { EmptyView } from "@widgets/GroupTourList/ui/EmptyView.tsx";
import { Skeleton } from "@shared/ui";
import { GroupTourCard } from "./GroupTourCard";

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
  const { isLoadingFilteredHotelPackages } = useHotelPackagesSearchContext();
  const {
    data: groupToursResponse,
    isLoading: isLoadingGroupTours,
  } = useGroupToursList({ page: null, limit: null });

  const groupTours = groupToursResponse?.data ?? [];

  const isLoading =
    !groupTours.length &&
    (isLoadingGroupTours || isLoadingFilteredHotelPackages);

  const generateLink = (groupTourId: string) => {
    return `/group-tour/${groupTourId}`;
  };

  if (!isLoading && !groupTours?.length) {
    return <EmptyView />;
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
          rowGap={{base: 6, md: 10}}
          columnGap={6}
          justifyItems="center"
          w="100%"
        >
          <SkeletonLoading />
        </Grid>
      )}

      {!isLoading && groupTours.length > 0 && (
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          rowGap={{base: 6, md: 10}}
          columnGap={6}
          justifyItems="stretch"
          alignItems="stretch"
          autoRows="1fr"
          w="100%"
        >
          {groupTours.map((groupTour) =>
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
  <Box pt={{ base: 0, md: 5 }} pb={{ base: 16, md: 24}} width="100%">
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
