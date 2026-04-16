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
import { useQueryParams } from "@/hooks/useQueryParams";
import { useLocation } from "@shared/lib/router";
import { EmptyView } from "@widgets/PackageList/ui/EmptyView";
import moment from "moment/moment";
import { getHotelNightsByDate, getNightsByDate } from "@/features/helper";
import { PackageFilter } from "@/features/PackageFilter";
import { useFilterPackage } from "@/features/PackageFilter/hooks";
import { Skeleton } from "@shared/ui";
import { LoaderWithText } from "@/components/Loader/Loader";
import { useTranslation } from "react-i18next";

export const PackageList = () => {
  const { searchParams } = useQueryParams();
  const location = useLocation();
  const { t } = useTranslation();
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

    // Preserve the full list-search query so redirect fallbacks from details
    // can return users to their exact previous search state.
    const queryParams = new URLSearchParams(location.search);
    if (!queryParams.get("city")) {
      queryParams.set("city", tourPackage.city.id.toString());
    }
    queryParams.set("adultsCount", tourPackage.adultTravelers.toString());
    queryParams.set("childrenCount", childrenTravelers.toString());
    queryParams.set("hotelId", tourPackage.hotel.id.toString());
    queryParams.set("roomId", tourPackage.roomType.toString());

    if (isPackagesSearchView) {
      queryParams.set(
        "from",
        moment(packagesSearchData.fromDate).format("YYYY-MM-DD"),
      );
      queryParams.set(
        "to",
        moment(packagesSearchData.toDate).format("YYYY-MM-DD"),
      );
      queryParams.set(
        "childrenAges",
        packagesSearchData.travelersData.childrenCount > 0
          ? packagesSearchData.travelersData.childrenAges.join(",")
          : "",
      );
      pagePath = "package";
    } else {
      queryParams.set("from", moment(tourPackage.checkin).format("YYYY-MM-DD"));
      queryParams.set("to", moment(tourPackage.checkout).format("YYYY-MM-DD"));
      queryParams.set(
        "childrenAges",
        hotelSearchData.travelersData.childrenCount > 0
          ? hotelSearchData.travelersData.childrenAges.join(",")
          : "",
      );
    }

    queryParams.set("tab", isPackagesSearchView ? "packages" : "hotel");

    const newSearchParams = queryParams.toString();

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
      <Layout >
        <LoaderWithText style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} loading={isLoadingPackages || false} title={t("loading.packages.title")} description={t("loading.packages.description")} />
      </Layout>
    );
  }

  return (
    <Layout>
      {!isLoadingPackages ? (
        <Box ml={{ base: 0, md: !isLoadingPackages ? "326px" : undefined }} width={{ base: 'full', md: 'auto' }}>
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
