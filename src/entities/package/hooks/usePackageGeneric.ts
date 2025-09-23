import { PackagesFields } from "@/modules/packages/data/packagesEnums";
import {
  IGeneratedMultivendorOffer,
  IGenerateMultivendorOffer,
} from "@/modules/packages/data/packagesTypes";
import { generateMultivendorOfferService } from "@/modules/packages/services/PackagesServices";
import { isLateCheckoutAtom, selectedPackageAtom } from "@/modules/packages/store/store";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import { DictionaryTypes, packageUseCases } from "../api";
import { useDictionary } from "./useDictionary";

export type PackageType = 'regular' | 'hotel';

export interface UsePackageOptions {
  packageType?: PackageType;
  autoFetch?: boolean;
}

export const usePackageGeneric = (options: UsePackageOptions = {}) => {
  const { packageType = 'regular', autoFetch = true } = options;
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [isLateCheckout] = useRecoilState(isLateCheckoutAtom);

  const [selectedPackage, setSelectedPackage] =
    useRecoilState(selectedPackageAtom);
  
  // Parse URL parameters
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const adultsCount = parseInt(searchParams.get("adultsCount") || "0", 10);
  const childrenAgesParam = searchParams.get("childrenAges");
  const childrenAges = childrenAgesParam
    ? childrenAgesParam?.split(",").filter(Boolean).map(Number) || []
    : [];
  const hotelId = parseInt(searchParams.get("hotelId") || "0", 10);
  const roomId = parseInt(searchParams.get("roomId") || "0", 10);
  const mealId = parseInt(searchParams.get("mealId") || "0", 10);

  // Format dates for hotel packages
  const checkin = useMemo(
    () =>
      from ? moment(from).set({ hour: 14 }).format("ddd MMM DD YYYY") : "",
    [from],
  );
  const checkout = useMemo(
    () => (to ? moment(to).set({ hour: 12 }).format("ddd MMM DD YYYY") : ""),
    [to],
  );

  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedMultivendorOffers, setGeneratedMultivendorOffers] = useState<
    IGeneratedMultivendorOffer[]
  >([]);
  const [isFetched, setIsFetched] = useState(false);

  // Get package details based on type
  const getPackageDetails = async (offerId: number, travelAgency: number) => {
    try {
      if (offerId && travelAgency) {
        const packageData = packageType === 'hotel' 
          ? await packageUseCases.getHotelPackage(offerId, travelAgency)
          : await packageUseCases.getPackage(offerId, travelAgency);
        setSelectedPackage(packageData);
      } else {
        setSelectedPackage(null);
      }
      setIsFetched(true);
    } catch (error) {
      console.error("Error getting package details:", error);
      setError(error as string);
      setIsFetched(true);
    }
  };

  // Fetch multivendor offers
  const fetchMultivendorOffers = (data: IGenerateMultivendorOffer) => {
    setLoading(true);
    setError(null);

    generateMultivendorOfferService(data)
      .then(({ data }) => {
        setGeneratedMultivendorOffers(data);
        if (!!data.length) {
          const offer = data[0]
          getPackageDetails(offer.offerId, offer.agency.id);
          return;
        }
        setSelectedPackage(null);
        setIsFetched(true);
        return;
      })
      .catch((error) => {
        console.error("Error generating multivendor offers:", error);
        setError(error);
      })
      .finally(() => setLoading(false));
  };

  // Get food types dictionary
  const { data: foodTypes = [] } = useDictionary(
    "FoodTypeDictionary" as DictionaryTypes.FoodTypeDictionary,
  );

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (!autoFetch) return;

    const data = {
      [PackagesFields.hotelId]: hotelId,
      [PackagesFields.dateFrom]: from || "",
      [PackagesFields.dateTo]: to || "",
      [PackagesFields.adults]: adultsCount,
      [PackagesFields.childs]: childrenAges,
      [PackagesFields.lateCheckout]: packageType === 'hotel' ? false : isLateCheckout,
      [PackagesFields.bookingType]: packageType === 'hotel' ? 2 : 1,
    };
    fetchMultivendorOffers(data);
  }, [autoFetch, packageType, isLateCheckout]);

  // Generate meal plans
  const mealPlans = useMemo(() => {
    const result: Record<
      number,
      { key: number; label: string; labelArm: string }
    > = {};
    generatedMultivendorOffers.forEach((offer) => {
      if (offer.foodType && !result[offer.foodType]) {
        result[offer.foodType] = {
          key: offer.foodType,
          label:
            foodTypes.find(({ key }) => key === offer.foodType)?.value || "",
          labelArm:
            foodTypes.find(({ key }) => key === offer.foodType)?.value || "",
        };
      }
    });

    if (Object.keys(result).length === 0) {
      const allInclusive = foodTypes.find(
        ({ value }) =>
          value.toLocaleLowerCase() === "All Inclusive".toLocaleLowerCase(),
      );
      return [
        {
          key: allInclusive?.key || 0,
          label: allInclusive?.value || "",
          labelArm: allInclusive?.value || "",
        },
      ];
    }
    return Object.values(result);
  }, [JSON.stringify(generatedMultivendorOffers), foodTypes]);

  return {
    // Data
    generatedMultivendorOffers,
    packageDetails: selectedPackage,
    mealPlans,
    
    // URL parameters
    childrenAges,
    hotelId,
    roomId,
    mealId,
    checkin,
    checkout,
    
    // State
    loading,
    error,
    isFetched,
    
    // Actions
    getPackageDetails,
    fetchMultivendorOffers,
    
    // Configuration
    packageType,
  };
};
