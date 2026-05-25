import { type LayoutProps } from "./types";
import {
  Box,
  Flex,
  VStack,
} from "@chakra-ui/react";
import {
  PackageCardSkeleton,
  type PackageEntity,
  useHotelPackagesSearchContext,
  usePackagesSearchContext,
} from "@entities/package";
import { PackageCardHorizontal } from "@features/PackageCard";
import { useEffect, useMemo, useState } from "react";
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
import { formatApproximateSearchDateLabel } from "@shared/helpers";
import { CompareFooterBar } from "./Compare/CompareFooterBar";
import { CompareModal } from "./Compare/CompareModal";
import { isCompareFeatureAvailable } from "./Compare/CompareModal/helpers";

const MAX_COMPARE_ITEMS = 5;

const getCompareKey = (packageEntity: PackageEntity) =>
  `${packageEntity.offerId}-${packageEntity.hotel.id}`;

export const PackageList = () => {
  const { searchParams } = useQueryParams();
  const location = useLocation();
  const { t, i18n } = useTranslation();
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
    cities: packageCities,
  } = usePackagesSearchContext();

  const {
    filteredHotelPackages,
    isLoadingFilteredHotelPackages,
    isAllowedSearchRoute: isHotelSearchView,
    searchData: hotelSearchData,
    cities: hotelCities,
    dateMode: hotelDateMode,
  } = useHotelPackagesSearchContext();

  const isApproximateSearch = useMemo(() => {
    const mode =
      hotelDateMode ?? (searchParams.dateMode as string | undefined);
    return mode === "approximate";
  }, [hotelDateMode, searchParams.dateMode]);

  const approximateDateLabel = useMemo(() => {
    if (!isApproximateSearch) {
      return undefined;
    }

    const days = hotelSearchData.days ?? Number(searchParams.days);
    const fromDate =
      hotelSearchData.fromDate ??
      (searchParams.from ? new Date(searchParams.from as string) : null);

    if (!days || !fromDate || Number.isNaN(fromDate.getTime())) {
      return undefined;
    }

    return formatApproximateSearchDateLabel(fromDate, days, t);
  }, [
    isApproximateSearch,
    hotelSearchData.days,
    hotelSearchData.fromDate,
    searchParams.days,
    searchParams.from,
    t,
  ]);

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
    queryParams.set("offerId", tourPackage.offerId.toString());
    queryParams.set("agencyId", tourPackage.travelAgency.id.toString());
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
  const selectedCityIds = useMemo(
    () =>
      isHotelSearchView
        ? Array.isArray(hotelSearchData.selectedCity)
          ? hotelSearchData.selectedCity
          : [hotelSearchData.selectedCity]
        : [packagesSearchData.selectedCity],
    [isHotelSearchView, hotelSearchData.selectedCity, packagesSearchData.selectedCity],
  );

  const activeCities = useMemo(
    () => (isHotelSearchView ? hotelCities : packageCities),
    [isHotelSearchView, hotelCities, packageCities],
  );

  const {
    filterOptions,
    filteredPackages: filteredActivePackages,
    isFilterActive,
    onFilter,
  }: ReturnType<typeof useFilterPackage> = useFilterPackage(
    activePackages,
    activeCities,
    selectedCityIds,
  );

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

  const isCompareEnabled = useMemo(
    () =>
      isCompareFeatureAvailable(
        activeCities,
        selectedCityIds,
        i18n.language,
      ),
    [activeCities, selectedCityIds, i18n.language],
  );

  const [selectedComparePackages, setSelectedComparePackages] = useState<
    PackageEntity[]
  >([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  useEffect(() => {
    if (!isCompareEnabled) {
      setSelectedComparePackages([]);
      setIsCompareModalOpen(false);
    }
  }, [isCompareEnabled]);

  useEffect(() => {
    if (!filteredActivePackages?.length) {
      setSelectedComparePackages([]);
      setIsCompareModalOpen(false);
      return;
    }

    const activeKeys = new Set(
      filteredActivePackages.map((item) => getCompareKey(item)),
    );

    setSelectedComparePackages((prev) =>
      prev.filter((item) => activeKeys.has(getCompareKey(item))),
    );
  }, [filteredActivePackages]);

  useEffect(() => {
    if (selectedComparePackages.length < 2 && isCompareModalOpen) {
      setIsCompareModalOpen(false);
    }
  }, [selectedComparePackages.length, isCompareModalOpen]);

  const selectedCompareKeys = useMemo(
    () => new Set(selectedComparePackages.map((item) => getCompareKey(item))),
    [selectedComparePackages],
  );

  const showCompareFooter =
    isCompareEnabled &&
    selectedComparePackages.length >= 1 &&
    !isCompareModalOpen;

  const handleCompareToggle = (
    packageEntity: PackageEntity,
    isChecked: boolean,
  ) => {
    setSelectedComparePackages((prev) => {
      const key = getCompareKey(packageEntity);
      const isAlreadySelected = prev.some((item) => getCompareKey(item) === key);

      if (isChecked) {
        if (isAlreadySelected || prev.length >= MAX_COMPARE_ITEMS) {
          return prev;
        }
        return [...prev, packageEntity];
      }

      return prev.filter((item) => getCompareKey(item) !== key);
    });
  };

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
        <LoaderWithText style={{ backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} loading={isLoadingPackages || false} title={t("loading.packages.title")} description={t("loading.packages.description")} />
      </Layout>
    );
  }

  return (
    <Layout hasCompareFooter={showCompareFooter}>
      {!isLoadingPackages ? (
        <Box ml={0} width={{ base: 'full', md: 'auto' }}>
          <PackageFilter
            isActive={isFilterActive}
            filterOptions={filterOptions}
            contentType={isPackagesSearchView ? "package" : "hotel"}
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
                isHotelPackage={isHotelSearchView}
                showCompare={isCompareEnabled}
                isCompareSelected={selectedCompareKeys.has(
                  getCompareKey(packageEntity),
                )}
                isCompareDisabled={
                  selectedComparePackages.length >= MAX_COMPARE_ITEMS &&
                  !selectedCompareKeys.has(getCompareKey(packageEntity))
                }
                onCompareToggle={(isChecked) =>
                  handleCompareToggle(packageEntity, isChecked)
                }
              />
            ))}
        </VStack>
      )}
      <CompareFooterBar
        selectedPackages={selectedComparePackages}
        maxCompareItems={MAX_COMPARE_ITEMS}
        getCompareKey={getCompareKey}
        onRemove={(key) =>
          setSelectedComparePackages((prev) =>
            prev.filter((item) => getCompareKey(item) !== key),
          )
        }
        onClear={() => setSelectedComparePackages([])}
        onCompare={() => setIsCompareModalOpen(true)}
        isHidden={isCompareModalOpen}
      />
      <CompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        packages={selectedComparePackages}
        cities={activeCities}
        selectedCityIds={selectedCityIds}
        maxCompareItems={MAX_COMPARE_ITEMS}
        itemTypeLabel={t(isPackagesSearchView ? 'package' : 'hotel')}
        approximateDateLabel={approximateDateLabel}
        onRemove={(packageEntity) =>
          setSelectedComparePackages((prev) =>
            prev.filter((item) => getCompareKey(item) !== getCompareKey(packageEntity)),
          )
        }
        getLink={generateLink}
      />
    </Layout>
  );
};


const Layout = ({ children, hasCompareFooter = false }: LayoutProps) => (
  <Box py={{ base: 6, md: 10 }} width="100%" background="white">
    <Box
      px={{ base: 4, md: 6, lg: 8 }}
      pb={hasCompareFooter ? { base: "104px", md: "120px" } : 0}
    >
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
