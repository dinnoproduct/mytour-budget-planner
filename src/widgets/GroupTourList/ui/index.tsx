import { type LayoutProps } from "./types";
import { Box, Flex, Grid, GridItem, VStack } from "@chakra-ui/react";
import {
  useGroupToursList,
  useHotelPackagesSearchContext,
} from "@entities/package";
import { useMemo } from "react";
import { EmptyView } from "@widgets/GroupTourList/ui/EmptyView.tsx";
import { Skeleton } from "@shared/ui";
import { GroupTourCard } from "./GroupTourCard";

export const GroupTourList = () => {
  const {
    filteredHotelPackages,
    isLoadingFilteredHotelPackages,
  } = useHotelPackagesSearchContext();
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

  // empty view
  if (!isLoading && !groupTours?.length) {
    return (
      <EmptyView />
    );
  }

  return (
    <Layout>
      {isLoading && (
        <Grid 
          templateColumns={{base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)'}} rowGap={'40px'} columnGap={'24px'}
          justifyItems='center'
          w="100%"
        >
          <SkeletonLoading />
        </Grid>
      )}

      {!isLoading && groupTours.length > 0 && (
         <Grid 
         templateColumns={{base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)'}} rowGap={'40px'} columnGap={'24px'}
         justifyItems='center'
         w="100%"
       >
          {groupTours.map((groupTour) => (
            <GroupTourCard
              key={groupTour.id}
              groupTour={groupTour}
              link={generateLink(groupTour.id)}
            />
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
        key={`package-card-skeleton-${index}`} 
        width={{ base: '360px', md: '100%' }}
        height='380px'
      >
        <Skeleton
          width="100%"  
          height="100%"
          rounded="lg"
        />
      </GridItem>
    ));

const Layout = ({ children }: LayoutProps) => (
  <Box py={{ base: 6, md: 10 }} width="100%">
    <Box px={{ base: 4, md: 6, lg: 8 }}>
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
