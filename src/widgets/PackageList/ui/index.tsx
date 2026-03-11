import { type LayoutProps } from "./types";
import { Box, Flex, VStack } from "@chakra-ui/react";
import {
  PackageCardSkeleton,
  type PackageEntity,
  useHotelPackagesSearchContext,
  usePackagesSearchContext,
} from "@entities/package";
import { PackageCardHorizontal } from "@features/PackageCard";
import { useMemo } from "react";
import { useQueryParams } from "@/hooks/useQueryParams.ts";
import { EmptyView } from "@widgets/PackageList/ui/EmptyView.tsx";
import moment from "moment/moment";
import { getHotelNightsByDate, getNightsByDate } from "@/features/helper";
import { PackageFilter } from "@/features/PackageFilter";
import { useFilterPackage } from "@/features/PackageFilter/hooks";
import { Skeleton } from "@shared/ui";
import { PackageLoader } from "@/components/Loader/Loader";

export const PackageList = () => {
  const { searchParams } = useQueryParams();

  const activeTab = useMemo(() => {
    if (searchParams?.tab) {
      return searchParams.tab;
    }

    return "packages";
  }, [searchParams]);

  const {
    filteredPackages,
    isLoadingFilteredPackages,
    searchData: packagesSearchData,
    isSearchError,
    isAllowedSearchRoute: isPackagesSearchView,
  } = usePackagesSearchContext();

  const {
    filteredHotelPackages,
    isLoadingFilteredHotelPackages,
    isAllowedSearchRoute: isHotelSearchView,
    searchData: hotelSearchData,
  } = useHotelPackagesSearchContext();

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

    if (isPackagesSearchView) {
      queryParams.from = moment(packagesSearchData.fromDate).format(
        "YYYY-MM-DD",
      );
      queryParams.to = moment(packagesSearchData.toDate).format("YYYY-MM-DD");
      queryParams.childrenAges =
        packagesSearchData.travelersData.childrenCount > 0
          ? packagesSearchData.travelersData.childrenAges.join(",")
          : "";
      pagePath = "package";
    } else {
      queryParams.from = moment(tourPackage.checkin).format("YYYY-MM-DD");
      queryParams.to = moment(tourPackage.checkout).format("YYYY-MM-DD");
      queryParams.childrenAges =
        hotelSearchData.travelersData.childrenCount > 0
          ? hotelSearchData.travelersData.childrenAges.join(",")
          : "";
    }

    const newSearchParams = new URLSearchParams(queryParams).toString();

    const url = `/${pagePath}?${newSearchParams}`;

    return url;
  };

  const activePackages = useMemo(
    () => (isHotelSearchView ? filteredHotelPackages : filteredPackages),
    [isHotelSearchView, filteredPackages, filteredHotelPackages],
  );
  const {
    filterOptions,
    filteredPackages: filteredActivePackages,
    isFilterActive,
    onFilter,
  }: ReturnType<typeof useFilterPackage> = useFilterPackage(activePackages);

  const isLoadingPackages = useMemo(
    () =>
      isHotelSearchView
        ? isLoadingFilteredHotelPackages
        : isLoadingFilteredPackages,
    [
      isHotelSearchView,
      isLoadingFilteredPackages,
      isLoadingFilteredHotelPackages,
    ],
  );

  // empty view
  if (!isLoadingPackages && !activePackages?.length) {
    return (
      <EmptyView searchView={isPackagesSearchView ? "packages" : "hotel"} />
    );
  }

  const getNights = () => {
    if (searchParams.from === null || searchParams.to === null) {
      return 0;
    }

    if (searchParams.days) {
      return Number(searchParams.days) - 1;
    }

    const fromDate = new Date(searchParams.from as string);
    const toDate = new Date(searchParams.to as string);

    return isHotelSearchView
      ? getHotelNightsByDate(fromDate, toDate)
      : getNightsByDate(fromDate, toDate);
  };

  if (isLoadingFilteredHotelPackages || isLoadingFilteredPackages || isLoadingPackages) {
    return (
      <Layout>
        <PackageLoader loading={isLoadingPackages || false} />
      </Layout>
    );
  }

  return (
    <Layout>
      {!isLoadingPackages ? (
        <Box ml={{ base: 0, md: !isLoadingPackages ? "326px" : undefined }}>
          <PackageFilter
            isActive={isFilterActive}
            filterOptions={filterOptions}
            onFilter={onFilter}
          />
        </Box>
      ) : (
        <Skeleton minW="326px" width="326px" rounded="lg" />
      )}
      {!isLoadingPackages && filteredActivePackages.length === 0 && (
        <EmptyView
          searchView={isPackagesSearchView ? "filter-packages" : "filter-hotel"}
        />
      )}

      {!isLoadingPackages && filteredActivePackages.length > 0 && (
        <VStack spacing={4} flexGrow={1} width="full">
          {!isLoadingPackages &&
            filteredActivePackages?.map((packageEntity) => (
              <PackageCardHorizontal
                tourPackage={packageEntity}
                key={packageEntity.offerId + "---" + packageEntity.hotel.id}
                link={generateLink(packageEntity)}
                nights={getNights()} // todo: check nights
              />
            ))}
        </VStack>
      )}
    </Layout>
  );
};


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
