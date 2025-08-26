import React, { useMemo } from "react";
import { HStack, Text } from "@chakra-ui/react";
import { IGeneratedMultivendorOffer } from "@/modules/packages/data/packagesTypes";
import { useDictionary } from "@/entities/package";
import { DictionaryTypes } from "@/entities/package";
import { Button } from "@/shared/ui";

export type MealPlan =
  | "all_inclusive"
  | "breakfast"
  | "half_board"
  | "full_board";

export interface MealPlanSelectorProps {
  selectedMealPlan: number;
  onMealPlanChange: (mealPlan: number) => void;
  disabled?: boolean;
  generatedMultivendorOffers?: IGeneratedMultivendorOffer[];
}

export const MealPlanSelector: React.FC<MealPlanSelectorProps> = ({
  selectedMealPlan,
  onMealPlanChange,
  disabled = false,
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
    <HStack p={3} width="full" overflowX="auto">
      {mealPlans.map((mealPlan) => {
        const isSelected = selectedMealPlan === mealPlan.key;
        return (
          <Button
            key={mealPlan.key}
            onClick={() => onMealPlanChange(mealPlan.key)}
            disabled={disabled}
            size="md"
            borderRadius="lg"
            px={4}
            py={2}
            minW="auto"
            height="auto"
            bg={isSelected ? "blue.500" : "white"}
            color={isSelected ? "white" : "gray.600"}
            border="1px solid"
            borderColor={isSelected ? "blue.500" : "gray.300"}
            _hover={{
              bg: isSelected ? "blue.600" : "gray.50",
              borderColor: isSelected ? "blue.600" : "gray.300",
            }}
            _active={{
              bg: isSelected ? "blue.700" : "gray.100",
            }}
            transition="all 0.2s"
          >
            <Text fontSize="sm" fontWeight="medium">
              {mealPlan.labelArm}
            </Text>
          </Button>
        );
      })}
    </HStack>
  );
};
