import React, { useMemo } from "react";
import { Button, HStack, Text } from "@chakra-ui/react";
import { IGeneratedMultivendorOffer } from "@/modules/packages/data/packagesTypes";
import { useDictionary } from "@/entities/package";
import { DictionaryTypes } from "@/entities/package";

export type MealPlan =
  | "all_inclusive"
  | "breakfast"
  | "half_board"
  | "full_board";

export interface MealPlanSelectorProps {
  selectedMealPlan: number;
  onMealPlanChange: (mealPlan: number) => void;
  generatedMultivendorOffers?: IGeneratedMultivendorOffer[];
}

export const MealPlanSelector: React.FC<MealPlanSelectorProps> = ({
  selectedMealPlan,
  onMealPlanChange,
  generatedMultivendorOffers = [],
}) => {
  const { data: foodTypes = [] } = useDictionary(
    "FoodTypeDictionary" as DictionaryTypes.FoodTypeDictionary,
  );

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
  }, [generatedMultivendorOffers]);

  return (
    <HStack py={3} width="fit-content" overflowX="auto">
      {mealPlans.map((mealPlan) => {
        const isSelected = selectedMealPlan === mealPlan.key;
        return (
          <Button
            key={mealPlan.key}
            onClick={() => onMealPlanChange(mealPlan.key)}
            borderRadius="3xl"
            px={4}
            py={2}
            size={{ base: "lg"}}
            fontSize="lg"
            variant={isSelected ? "solid" : "outline"}
            colorScheme={isSelected ? "blue" : "gray"}
          >
            <Text fontSize="sm" fontWeight="medium" color={isSelected ? "white" : "gray.600"}>
              {mealPlan.labelArm}
            </Text>
          </Button>
        );
      })}
    </HStack>
  );
};
