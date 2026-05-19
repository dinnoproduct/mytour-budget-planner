"use client"

import { PackagesFields } from "@/modules/packages/data/packagesEnums";
import {
  IGeneratedMultivendorOffer,
  IGenerateMultivendorOffer,
} from "@/modules/packages/data/packagesTypes";
import { generateMultivendorOfferService } from "@/modules/packages/services/PackagesServices";
import { isLateCheckoutAtom } from "@/modules/packages/store/store";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "@shared/lib/router";
import { useRecoilState } from "recoil";
import { DictionaryTypes, packageUseCases } from "../api";
import { useDictionary } from "./useDictionary";
import { useSelectedPackage } from "@/modules/packages/hooks";

export type PackageType = "regular" | "hotel";

export interface UsePackageOptions {
  packageType?: PackageType;
  autoFetch?: boolean;
}

export const usePackageGeneric = (options: UsePackageOptions = {}) => {
  const { packageType = "regular", autoFetch = true } = options;

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [isLateCheckout] = useRecoilState(isLateCheckoutAtom);

  const { selectedPackage, storeSelectedPackage, clearSelectedPackage } =
    useSelectedPackage();

  // Parse URL parameters
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const adultsCount = parseInt(searchParams.get("adultsCount") || "0", 10);
  const childrenCountParam = searchParams.get("childrenCount");
  const childrenCount = parseInt(childrenCountParam || "0", 10);
  const childrenAgesParam = searchParams.get("childrenAges");
  const childrenAges = childrenCount === 0 
    ? [] 
    : (childrenAgesParam
        ? childrenAgesParam?.split(",").filter(Boolean).map(Number) || []
        : []);
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
        const packageData =
          packageType === "hotel"
            ? await packageUseCases.getHotelPackage(offerId, travelAgency)
            : await packageUseCases.getPackage(offerId, travelAgency);
        storeSelectedPackage(packageData);
      } else {
        clearSelectedPackage();
      }
    } catch (error) {
      console.error("Error getting package details:", error);
      setError(error as string);
    }
  };

  // Fetch multivendor offers
  const fetchMultivendorOffers = async (data: IGenerateMultivendorOffer) => {
    setLoading(true);
    setError(null);

    try {
      const { data: offers } = await generateMultivendorOfferService(data);
      setGeneratedMultivendorOffers(offers);

      if (!!offers.length) {
        const offer = offers[0];
        await getPackageDetails(offer.offerId, offer.agency.id);
      } else {
        clearSelectedPackage();
      }
    } catch (error) {
      console.error("Error generating multivendor offers:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsFetched(true);
      setLoading(false);
    }
  };

  // Get food types dictionary
  const { data: foodTypes = [] } = useDictionary(
    "FoodTypeDictionary" as DictionaryTypes.FoodTypeDictionary,
  );

  // Determine dateFrom and dateTo for the request
  // For hotels: use checkIn/checkOut from selectedPackage if available (from search endpoint)
  // Otherwise: use URL params
  const dateFrom = useMemo(() => {
    if (packageType === "hotel" && selectedPackage?.checkin) {
      // Use checkIn from selectedPackage for hotels (from search endpoint)
      return moment(selectedPackage.checkin).format("YYYY-MM-DD");
    }
    return from || "";
  }, [packageType, selectedPackage?.checkin, from]);

  const dateTo = useMemo(() => {
    if (packageType === "hotel" && selectedPackage?.checkout) {
      // Use checkOut from selectedPackage for hotels (from search endpoint)
      return moment(selectedPackage.checkout).format("YYYY-MM-DD");
    }
    return to || "";
  }, [packageType, selectedPackage?.checkout, to]);

  useEffect(() => {
    () => {
      clearSelectedPackage();
    };
  }, []);
  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (!autoFetch) return;

    const data = {
      [PackagesFields.hotelId]: hotelId,
      [PackagesFields.dateFrom]: dateFrom,
      [PackagesFields.dateTo]: dateTo,
      [PackagesFields.adults]: adultsCount,
      [PackagesFields.childs]: childrenCount === 0 ? [] : childrenAges,
      [PackagesFields.lateCheckout]:
        packageType === "hotel" ? false : isLateCheckout,
      [PackagesFields.bookingType]: packageType === "hotel" ? 2 : 1,
    };
    fetchMultivendorOffers(data);
  }, [autoFetch, packageType, isLateCheckout, dateFrom, dateTo]);

  // Generate meal plans
  const mealPlans = useMemo(() => {
    const seen = new Set<number>();
    const result: { key: number; label: string; labelArm: string }[] = [];

    generatedMultivendorOffers.forEach((offer) => {
      if (offer.foodType && !seen.has(offer.foodType)) {
        seen.add(offer.foodType);
        result.push({
          key: offer.foodType,
          label:
            foodTypes.find(({ key }) => key === offer.foodType)?.value || "",
          labelArm:
            foodTypes.find(({ key }) => key === offer.foodType)?.value || "",
        });
      }
    });

    if (result.length === 0) {
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
    return result;
  }, [JSON.stringify(generatedMultivendorOffers), foodTypes]);

  return {
    // Data
    generatedMultivendorOffers,
    packageDetails: selectedPackage,
    mealPlans,

    // URL parameters
    childrenAges,
    childrenCount,
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
