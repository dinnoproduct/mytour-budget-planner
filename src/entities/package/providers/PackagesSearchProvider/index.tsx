"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useSearchParams } from "@shared/lib/router";
import { useLanguageNavigate } from "../../../../hooks/useLanguageNavigate";
import { getPathWithoutLanguage } from "../../../../utils/languageRoutes";
import moment from "moment";
import { type SearchContextType, type SearchData } from "./types";
import {
  type FlightEntity,
  type PackageEntity,
  useAvailableFlights,
  useCities,
  usePackageList,
  useReturnFlights,
  useSearchAsync,
} from "@entities/package";
import { appendStoredUTMsToSearchParams } from "@/utils/utmParams";

const LOCAL_STORAGE_KEY = "package_search_params";

const defaultSearchData: SearchData = {
  fromDate: null,
  toDate: null,
  selectedCity: 1,
  travelersData: {
    adultsCount: 2,
    childrenCount: 0,
    childrenAges: [],
  },
};

const ALLOWED_SEARCH_ROUTES = [
  { path: "/packages", query: [["tab", "packages"]] },
];

const ALLOWED_PACKAGE_ROUTES = [
  { path: "/packages", query: [["tab", "packages"]] },
  { path: "/" },
  { path: "/package" },
];

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const PackagesSearchProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { navigateToPackages } = useLanguageNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const safeSearchParams = searchParams ?? new URLSearchParams();
  const [isCityChanged, setIsCityChanged] = useState(false);
  const [isDefaultSearchDone, setIsDefaultSearchDone] = useState(false);

  const hasInitializedData = useRef(false);

  const isAllowedSearchRoute = useMemo(() => {
    const pathWithoutLanguage = getPathWithoutLanguage(location.pathname || "");
    const isAllowed = ALLOWED_SEARCH_ROUTES.some((route) => {
      if (route.path === pathWithoutLanguage) {
        if (route.query.length === 0) {
          return true;
        }

        return route.query.every((query) => {
          const value = safeSearchParams.get(query[0]);

          return value && value === query[1];
        });
      }

      return false;
    });

    return isAllowed;
  }, [location.pathname, searchParams]);

  const isAllowedPackageRoute = useMemo(() => {
    const pathWithoutLanguage = getPathWithoutLanguage(location.pathname || "");
    const isAllowed = ALLOWED_PACKAGE_ROUTES.some((route) => {
      if (route.path === pathWithoutLanguage) {
        if (!route.query || route.query.length === 0) {
          return true;
        }

        return route.query.every((query) => {
          const value = safeSearchParams.get(query[0]);

          return value && value === query[1];
        });
      }

      return false;
    });

    return isAllowed;
  }, [location.pathname, searchParams]);

  const { data: cities = [] } = useCities({
    enabled: isAllowedPackageRoute,
  });

  const { data: packageList = [] } = usePackageList({
    enabled: isAllowedSearchRoute,
  });

  // Memoize package list dependency to prevent unnecessary re-renders
  const packageListKey = useMemo(() => {
    if (!Array.isArray(packageList) || packageList.length === 0) {
      return "";
    }
    return packageList
      .map((pkg) => `${pkg.offerId || pkg.id}`)
      .sort()
      .join(",");
  }, [packageList]);

  // Memoize cities dependency to prevent unnecessary re-renders
  const citiesKey = useMemo(() => {
    if (!Array.isArray(cities) || cities.length === 0) {
      return "";
    }
    return cities
      .map((city) => `${city.id}`)
      .sort()
      .join(",");
  }, [cities]);

  const [filteredPackages, setFilteredPackages] = useState<PackageEntity[]>([]);
  const [isLoadingFilteredPackages, setIsLoadingFilteredPackages] =
    useState(false);
  const [isSearchError, setIsSearchError] = useState(false);
  const searchAsync = useSearchAsync();
  const [searchData, setSearchDataState] =
    useState<SearchData>(defaultSearchData);
  const [availableDepartureDates, setAvailableDepartureDates] = useState<
    Date[]
  >([]);
  const [availableReturnDates, setAvailableReturnDates] = useState<Date[]>([]);

  const [selectedDepartureFlight, setSelectedDepartureFlight] =
    useState<FlightEntity | null>(null);

  const [selectedReturnFlight, setSelectedReturnFlight] =
    useState<FlightEntity | null>(null);

  const saveSearchDataToLocalStorage = (data: SearchData) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  };

  // Function to load searchData from localStorage
  const loadSearchDataFromLocalStorage = (): SearchData | null => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);

    return savedData ? JSON.parse(savedData) : null;
  };

  // set default search data
  useEffect(() => {
    // if search data is already set or already initialized, do nothing
    if (hasInitializedData.current || (searchData.fromDate && searchData.toDate)) {
      return;
    }

    // Only proceed if we have cities or packageList data
    if (cities.length === 0 && (!packageList || packageList.length === 0)) {
      return;
    }

    const savedSearchData = loadSearchDataFromLocalStorage();
    const fromDate = savedSearchData?.fromDate
      ? moment(savedSearchData?.fromDate)
      : null;
    const today = moment().startOf("day");

    let updatedSearchData = { ...searchData };

    if (!updatedSearchData.selectedCity && cities[0]?.id) {
      updatedSearchData.selectedCity = cities[0]?.id;
    }

    if (
      savedSearchData?.fromDate &&
      savedSearchData?.toDate &&
      fromDate &&
      fromDate.isSameOrAfter(today) &&
      savedSearchData.selectedCity
    ) {
      updatedSearchData = {
        ...updatedSearchData,
        ...savedSearchData,
        fromDate: new Date(savedSearchData.fromDate),
        toDate: new Date(savedSearchData.toDate),
      };
    }
    // set search data from default packages
    else {
      const packageItem = packageList?.[0];

      if (packageItem?.offerId && !searchData.fromDate && !searchData.toDate) {
        updatedSearchData = {
          ...updatedSearchData,
          fromDate: new Date(packageItem.destinationFlight.departureDate),
          toDate: new Date(packageItem.returnFlight.arrivalDate),
          selectedCity: packageItem.city.id,
        };
      }
    }

    setSearchData(updatedSearchData, true);
    hasInitializedData.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageListKey, citiesKey]);

  const { data: departureFlights } = useAvailableFlights(
    {
      destinationId: searchData.selectedCity,
    },
    {
      enabled: searchData.selectedCity !== -1 && isAllowedPackageRoute,
    },
  );

  const { data: returnFlights, isLoading: isLoadingReturnFlights } =
    useReturnFlights(
      selectedDepartureFlight as FlightEntity,
      {
        destinationId: searchData.selectedCity as number,
      },
      {
        enabled: !!selectedDepartureFlight?.id && isAllowedPackageRoute,
      },
    );

  // Memoize departure flights dependency to prevent unnecessary re-renders
  const departureFlightsKey = useMemo(() => {
    if (!Array.isArray(departureFlights) || departureFlights.length === 0) {
      return "";
    }
    return departureFlights
      .map((flight) => `${flight.id}-${flight.departureDate}`)
      .sort()
      .join(",");
  }, [departureFlights]);

  // Memoize return flights dependency to prevent unnecessary re-renders
  const returnFlightsKey = useMemo(() => {
    if (!Array.isArray(returnFlights) || returnFlights.length === 0) {
      return "";
    }
    return returnFlights
      .map((flight) => `${flight.id}-${flight.arrivalDate}`)
      .sort()
      .join(",");
  }, [returnFlights]);

  useEffect(() => {
    // Skip if no departure flights
    if (!Array.isArray(departureFlights) || departureFlights.length === 0) {
      return;
    }

    const dates = departureFlights
      .map((flight) => new Date(flight.departureDate))
      .sort((a, b) => a.getTime() - b.getTime());
    setAvailableDepartureDates(dates);
    setSelectedDepartureFlight(departureFlights[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departureFlightsKey]);

  useEffect(() => {
    // Skip if no return flights
    if (!returnFlights || returnFlights.length === 0) {
      return;
    }

    const dates = returnFlights.map((flight) => new Date(flight.arrivalDate));
    setAvailableReturnDates(dates);

    if (isCityChanged && departureFlights) {
      const packageItem = packageList?.[0];

      if (returnFlights[0]) {
        setSearchData({
          toDate: dates[0],
          fromDate: new Date(departureFlights[0].departureDate),
        });
      } else if (
        packageItem &&
        searchData.selectedCity === packageItem.city.id
      ) {
        setSearchData({
          toDate: new Date(packageItem.returnFlight.arrivalDate),
          fromDate: new Date(packageItem.destinationFlight.departureDate),
        });
      }

      setIsCityChanged(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnFlightsKey, isCityChanged, departureFlightsKey, packageList?.[0]?.offerId, searchData.selectedCity]);

  useEffect(() => {
    const selectedFlight = returnFlights?.find((flight) =>
      moment(flight.arrivalDate).isSame(searchData.toDate, "day"),
    );

    if (selectedFlight) {
      setSelectedReturnFlight(selectedFlight);
    }
  }, [searchData.toDate]);

  const handleFromDateClick = (date: Date) => {
    const selectedFlight = departureFlights?.find((flight) =>
      moment(flight.departureDate).isSame(date, "day"),
    );

    if (selectedFlight) {
      setSelectedDepartureFlight(selectedFlight);
    }
  };

  const generateSearchQueryParams = (searchData: SearchData) => {
    const formatDate = (date: Date | null) =>
      date ? moment(date).format("YYYY-MM-DD") : "";

    // Preserve existing query params (e.g. filter params) when regenerating
    // the packages search URL.
    const queryParams = new URLSearchParams(safeSearchParams.toString());
    queryParams.set("from", formatDate(searchData.fromDate));
    queryParams.set("to", formatDate(searchData.toDate));
    queryParams.set("city", searchData.selectedCity + "");
    queryParams.set(
      "adultsCount",
      searchData.travelersData.adultsCount.toString()
    );
    queryParams.set(
      "childrenCount",
      searchData.travelersData.childrenCount.toString()
    );
    queryParams.set(
      "childrenAges",
      searchData.travelersData.childrenCount === 0
        ? ""
        : searchData.travelersData.childrenAges.join(",")
    );
    queryParams.set("tab", "packages");

    return queryParams;
  };

  const handleSearch = async (searchData: SearchData) => {
    try {
      setIsSearchError(false);
      const { fromDate, toDate, selectedCity, travelersData } = searchData;
      const queryParams = generateSearchQueryParams(searchData);
      appendStoredUTMsToSearchParams(queryParams);
      navigateToPackages(queryParams.toString());

      setIsLoadingFilteredPackages(true);
      saveSearchDataToLocalStorage(searchData);

      const searchPackagesResponse = await searchAsync({
        dateFrom: moment(fromDate).format("YYYY-MM-DD"),
        dateTo: moment(toDate).format("YYYY-MM-DD"),
        cities: [selectedCity],
        adults: travelersData.adultsCount,
        childs: travelersData.childrenCount === 0 ? [] : travelersData.childrenAges,
        // nightsCorrectionLowerValue: 0,
        // nightsCorrectionUpperValue: 0,
        lateCheckout: false,
        bookingType: 1,
      });
      setFilteredPackages(searchPackagesResponse);
    } catch (error) {
      setIsSearchError(true);
    } finally {
      setIsLoadingFilteredPackages(false);
    }
  };

  const setSearchData = (
    data: Partial<SearchData>,
    isDefaultData?: boolean,
  ) => {
    if (!isDefaultData && data.selectedCity) {
      setIsCityChanged(true);
    }

    setSearchDataState((prevData) => {
      const newData = { ...prevData, ...data };
      return newData;
    });
  };

  const navigateToDefaultSearch = () => {
    const queryParams = generateSearchQueryParams(searchData);
    appendStoredUTMsToSearchParams(queryParams);
    navigateToPackages(queryParams.toString());
  };

  useEffect(() => {
    if (
      isAllowedSearchRoute &&
      searchData.fromDate &&
      searchData.toDate &&
      filteredPackages.length === 0 &&
      !isDefaultSearchDone
    ) {
      handleSearch(searchData);
      setIsDefaultSearchDone(true);
    }
  }, [
    isAllowedSearchRoute,
    searchData.fromDate,
    searchData.toDate,
    filteredPackages.length,
    isDefaultSearchDone,
  ]);

  useEffect(() => {
    if (!isAllowedSearchRoute) {
      return;
    }

    const getDateParam = (param: string | null) =>
      param ? new Date(param) : null;

    const currentData = {} as Partial<SearchData>;

    const fromParam = safeSearchParams.get("from");
    const toParam = safeSearchParams.get("to");
    const cityParam = safeSearchParams.get("city");
    const adultsCountParam = safeSearchParams.get("adultsCount");
    const childrenCountParam = safeSearchParams.get("childrenCount");
    const childrenAgesParam = safeSearchParams.get("childrenAges");

    if (fromParam) {
      currentData.fromDate = getDateParam(fromParam);
    }

    if (toParam) {
      currentData.toDate = getDateParam(toParam);
    }

    if (cityParam) {
      currentData.selectedCity = parseInt(cityParam, 10);
    }

    if (childrenCountParam || childrenAgesParam || adultsCountParam) {
      const childrenCount = parseInt(childrenCountParam || "0", 10)
      currentData.travelersData = {
        adultsCount: parseInt(adultsCountParam || "0", 10),
        childrenCount: childrenCount,
        childrenAges: childrenCount === 0
          ? []
          : ((childrenAgesParam || "").split(",").filter(Boolean).map(Number) || []),
      };
    }

    setSearchData(currentData, true);
  }, [searchParams, isAllowedSearchRoute]);

  return (
    <SearchContext.Provider
      value={{
        searchData,
        handleSearch,
        setSearchData,
        availableDepartureDates,
        availableReturnDates,
        isLoadingReturnDates: isLoadingReturnFlights,
        handleFromDateClick,
        filteredPackages,
        isLoadingFilteredPackages,
        isSearchError,
        generateSearchQueryParams,
        isAllowedSearchRoute,
        navigateToDefaultSearch,
        cities,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const usePackagesSearchContext = () => {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error(
      "useSearchContext must be used within a PackagesSearchProvider",
    );
  }

  return context;
};
