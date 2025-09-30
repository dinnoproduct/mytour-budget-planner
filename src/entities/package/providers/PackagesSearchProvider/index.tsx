import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation, useSearchParams } from "react-router-dom";
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
  const [isCityChanged, setIsCityChanged] = useState(false);
  const [isDefaultSearchDone, setIsDefaultSearchDone] = useState(false);
  useState(false);

  const isAllowedSearchRoute = useMemo(() => {
    const pathWithoutLanguage = getPathWithoutLanguage(location.pathname);
    const isAllowed = ALLOWED_SEARCH_ROUTES.some((route) => {
      if (route.path === pathWithoutLanguage) {
        if (route.query.length === 0) {
          return true;
        }

        return route.query.every((query) => {
          const value = searchParams.get(query[0]);

          return value && value === query[1];
        });
      }

      return false;
    });

    return isAllowed;
  }, [location.pathname, searchParams]);

  const isAllowedPackageRoute = useMemo(() => {
    const pathWithoutLanguage = getPathWithoutLanguage(location.pathname);
    const isAllowed = ALLOWED_PACKAGE_ROUTES.some((route) => {
      if (route.path === pathWithoutLanguage) {
        if (!route.query || route.query.length === 0) {
          return true;
        }

        return route.query.every((query) => {
          const value = searchParams.get(query[0]);

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
    // if search data is already set, do nothing
    if (searchData.fromDate && searchData.toDate) {
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

      if (
        packageItem?.offerId &&
        !searchData.fromDate &&
        !searchData.toDate
      ) {
        updatedSearchData = {
          ...updatedSearchData,
          fromDate: new Date(packageItem.destinationFlight.departureDate),
          toDate: new Date(packageItem.returnFlight.arrivalDate),
          selectedCity: packageItem.city.id,
        };
      }
    }

    setSearchData(updatedSearchData, true);
  }, [JSON.stringify(packageList), cities]);

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
        enabled:
          !!selectedDepartureFlight?.id &&
          isAllowedPackageRoute,
      },
    );

  useEffect(() => {
    if (Array.isArray(departureFlights)) {
      const dates = departureFlights.map(
        (flight) => new Date(flight.departureDate),
      );
      setAvailableDepartureDates(dates);
      setSelectedDepartureFlight(departureFlights[0]);
    }
  }, [departureFlights]);

  useEffect(() => {
    if (returnFlights) {
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
    }
  }, [JSON.stringify(returnFlights)]);

  useEffect(() => {
    const selectedFlight = returnFlights?.find((flight) =>
      moment(flight.arrivalDate).isSame(searchData.toDate, "day"),
    );

    if(selectedFlight) {
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

    const queryParams = new URLSearchParams({
      from: formatDate(searchData.fromDate),
      to: formatDate(searchData.toDate),
      city: searchData.selectedCity + "",
      adultsCount: searchData.travelersData.adultsCount.toString(),
      childrenCount: searchData.travelersData.childrenCount.toString(),
      childrenAges: searchData.travelersData.childrenAges.join(","),
      tab: "packages",
    });

    return queryParams;
  };

  const handleSearch = async (searchData: SearchData) => {
    try {
      setIsSearchError(false);
      const {
        fromDate,
        toDate,
        selectedCity,
        travelersData,
      } = searchData;
      const queryParams = generateSearchQueryParams(searchData);
      navigateToPackages(queryParams.toString());

      setIsLoadingFilteredPackages(true);
      saveSearchDataToLocalStorage(searchData);

      const searchPackagesResponse = await searchAsync({
        dateFrom: moment(fromDate).format("YYYY-MM-DD"),
        dateTo: moment(toDate).format("YYYY-MM-DD"),
        cities: [selectedCity],
        adults: travelersData.adultsCount,
        childs: travelersData.childrenAges,
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

    setSearchDataState((prevData) => ({ ...prevData, ...data }));
  };

  const navigateToDefaultSearch = () => {
    const queryParams = generateSearchQueryParams(searchData);
    navigateToPackages(queryParams.toString());
  };

  useEffect(() => {
    if (
      isAllowedSearchRoute &&
      filteredPackages.length === 0 &&
      !isDefaultSearchDone
    ) {
      handleSearch(searchData);
      setIsDefaultSearchDone(true);
    }
  }, [
    filteredPackages.length,
    isAllowedSearchRoute,
  ]);

  useEffect(() => {
    if (!isAllowedSearchRoute) {
      return;
    }

    const getDateParam = (param: string | null) =>
      param ? new Date(param) : null;

    const currentData = {} as SearchData;

    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");
    const cityParam = searchParams.get("city");
    const adultsCountParam = searchParams.get("adultsCount");
    const childrenCountParam = searchParams.get("childrenCount");
    const childrenAgesParam = searchParams.get("childrenAges");

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
      currentData.travelersData = {
        adultsCount: parseInt(adultsCountParam || "0", 10),
        childrenCount: parseInt(childrenCountParam || "0", 10),
        childrenAges:
          (childrenAgesParam || "").split(",").filter(Boolean).map(Number) ||
          [],
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
