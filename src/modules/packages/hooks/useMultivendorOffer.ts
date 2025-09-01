import { useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import { generateMultivendorOfferService } from "../services/PackagesServices";
import { generatedMultivendorOffersAtom } from "../store/store";
import {
  type IGeneratedMultivendorOffer,
  type IGenerateMultivendorOffer,
} from "../data/packagesTypes";
import { DictionaryTypes, useDictionary } from "@/entities/package";

const useMultivendorOffer = () => {
  const [loading, setLoading] = useState(false);
  const [generatedMultivendorOffers, setGeneratedMultivendorOffers] =
    useRecoilState(generatedMultivendorOffersAtom);

  const { data: foodTypes = [] } = useDictionary(
    "FoodTypeDictionary" as DictionaryTypes.FoodTypeDictionary,
  );

  const generateMultivendorOffers = (
    data: IGenerateMultivendorOffer,
    onSuccess?: (data: IGeneratedMultivendorOffer[]) => void,
  ) => {
    setLoading(true);
    void generateMultivendorOfferService(data)
      .then(({ data }) => {
        setGeneratedMultivendorOffers(data);
        onSuccess?.(data);
      })
      .catch((error) => {
        console.error("Error generating multivendor offers:", error);
        // You can add error state management here if needed
      })
      .finally(() => setLoading(false));
  };

  const mealPlans = useMemo(() => {
    const result: Record<
      number,
      { key: number; label: string; labelArm: string }
    > = {};
    generatedMultivendorOffers.forEach((offer) => {
      if (!result[offer.foodType]) {
        result[offer.foodType] = {
          key: offer.foodType,
          label:
            foodTypes.find(({ key }) => key === offer.foodType)?.value || "",
          labelArm:
            foodTypes.find(({ key }) => key === offer.foodType)?.value || "",
        };
      }
    });
    return Object.values(result);
  }, [generatedMultivendorOffers, foodTypes]);

  return {
    generatedMultivendorOffers,
    generateMultivendorOffers,
    loading,
    mealPlans,
    clearGeneratedMultivendorOffers: () => setGeneratedMultivendorOffers([]),
  };
};

export default useMultivendorOffer;
