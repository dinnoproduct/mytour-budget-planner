import { type LayoutProps } from "./types";
import { Box, Flex, VStack } from "@chakra-ui/react";
import {
  PackageCardSkeleton,
  type PackageEntity,
  useGroupToursList,
  useHotelPackagesSearchContext,
} from "@entities/package";
import { PackageCardHorizontal } from "@features/PackageCard";
import { useMemo } from "react";
import { useQueryParams } from "@/hooks/useQueryParams.ts";
import { EmptyView } from "@widgets/GroupTourList/ui/EmptyView.tsx";
import moment from "moment/moment";
import { getHotelNightsByDate, getNightsByDate } from "@/features/helper";
import { PackageFilter } from "@/features/PackageFilter";
import { useFilterPackage } from "@/features/PackageFilter/hooks";
import { Skeleton } from "@shared/ui";

export const GroupTourList = () => {
  const {
    filteredHotelPackages,
    isLoadingFilteredHotelPackages,
  } = useHotelPackagesSearchContext();
  const {
    data: groupTours = [],
    isLoading: isLoadingGroupTours,
  } = useGroupToursList();

  const tours = useMemo(
    () => (groupTours?.length ? groupTours : filteredHotelPackages),
    [groupTours, filteredHotelPackages],
  );

  const isLoading = useMemo(
    () => isLoadingGroupTours || (!groupTours.length && isLoadingFilteredHotelPackages),
    [isLoadingGroupTours, groupTours.length, isLoadingFilteredHotelPackages],
  );

  const generateLink = (tourPackage: PackageEntity) => {
    const childrenTravelers =
      tourPackage.childrenTravelers + tourPackage.infantTravelers;
    let pagePath = "hotel";

    const queryParams: any = {
      city: tourPackage.city.id.toString(),
      adultsCount: tourPackage.adultTravelers.toString(),
      childrenCount: childrenTravelers.toString(),
      hotelId: tourPackage.hotel.id.toString(),
      roomId: tourPackage.roomType.toString(),
    };

    const newSearchParams = new URLSearchParams(queryParams).toString();

    const url = `/${pagePath}?${newSearchParams}`;

    return url;
  };

  // empty view
  if (!isLoading && !tours?.length) {
    return (
      <EmptyView />
    );
  }

  return (
    <Layout>
      {!isLoading ? (
        <Box ml={{ base: 0, md: !isLoading ? "326px" : undefined }}>
          
        </Box>
      ) : (
        <Skeleton minW="326px" width="326px" rounded="lg" />
      )}

      {isLoading && (
        <VStack spacing={4} flexGrow={1} width="full">
          <SkeletonLoading />
        </VStack>
      )}

      {!isLoading && tours.length > 0 && (
        <VStack spacing={4} flexGrow={1} width="full">
          {tours?.map((hotelPackage) => (
              <PackageCardHorizontal
                tourPackage={hotelPackage}
                key={hotelPackage.offerId + "---" + hotelPackage.id}
                link={generateLink(hotelPackage)}
                nights={getNightsByDate(hotelPackage.checkin, hotelPackage.checkout)}
              />
            ))}  
        </VStack>
      )}
    </Layout>
  );
};

const SkeletonLoading = ({ carsCount = 8 }) =>
  Array(carsCount)
    .fill(1)
    .map((_data, index) => (
      <PackageCardSkeleton key={`package-card-skeleton-${index}`} />
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
