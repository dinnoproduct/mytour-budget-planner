import { type LayoutProps } from "./types";
import { Box, Flex, Grid, GridItem } from "@chakra-ui/react";
import {
  useGroupToursList,
  useHotelPackagesSearchContext,
} from "@entities/package";
import { useMemo } from "react";
import { EmptyView } from "@widgets/GroupTourList/ui/EmptyView.tsx";
import { Skeleton } from "@shared/ui";
import { GroupTourCard } from "./GroupTourCard";

export const GroupTourList = () => {
  const { isLoadingFilteredHotelPackages } = useHotelPackagesSearchContext();
  const {
    data: groupTours = [],
    isLoading: isLoadingGroupTours,
    isFetching: isFetchingGroupTours,
  } = useGroupToursList();

  const isLoading = useMemo(
    () =>
      isLoadingGroupTours ||
      isFetchingGroupTours ||
      (!groupTours.length && isLoadingFilteredHotelPackages),
    [
      isLoadingGroupTours,
      isFetchingGroupTours,
      groupTours.length,
      isLoadingFilteredHotelPackages,
    ],
  );

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
          {groupTours.map((groupTour) => (
            <GridItem key={groupTour.id} w="100%" h="100%">
              <GroupTourCard
                groupTour={groupTour}
                link={generateLink(groupTour.id)}
                w="100%"
                h="100%"
              />
            </GridItem>
          ))}
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
