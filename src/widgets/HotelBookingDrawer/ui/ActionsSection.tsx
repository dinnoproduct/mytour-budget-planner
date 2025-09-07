import { VStack } from "@chakra-ui/react";
import { MealPlanSelector } from "./MealPlanSelector";
import { LateCheckoutSection } from "./LateCheckoutSection";

interface IActionsSectionProps {
  selectedMealPlan: number;
  updateMealPlan: (mealPlan: number) => void;
  lateCheckout: boolean;
  handleLateCheckoutChange: (value: boolean) => void;
  mealPlans: { key: number; label: string; labelArm: string }[];
  isHotelPackage: boolean;
}

export const ActionsSection = ({
  selectedMealPlan,
  updateMealPlan,
  lateCheckout,
  handleLateCheckoutChange,
  mealPlans,
  isHotelPackage,
}: IActionsSectionProps) => {
  return (
    <VStack spacing={4} bg="white" align="stretch" py={4} px={6}>
      <VStack align="stretch" overflowX="auto">
        <MealPlanSelector
          selectedMealPlan={selectedMealPlan}
          onMealPlanChange={updateMealPlan}
          mealPlans={mealPlans}
        />
      </VStack>

      {!isHotelPackage && (
        <LateCheckoutSection
          lateCheckout={lateCheckout}
          onLateCheckoutChange={handleLateCheckoutChange}
        />
      )}
    </VStack>
  );
};
