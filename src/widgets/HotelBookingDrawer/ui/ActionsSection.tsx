import { Flex, VStack } from "@chakra-ui/react";
import { Checkbox, Icon, Tooltip } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import { MealPlanSelector } from "./MealPlanSelector";

interface IActionsSectionProps {
  selectedMealPlan: number;
  updateMealPlan: (mealPlan: number) => void;
  lateCheckout: boolean;
  handleLateCheckoutChange: (value: boolean) => void;
  mealPlans: { key: number; label: string; labelArm: string }[];
}

export const ActionsSection = ({
  selectedMealPlan,
  updateMealPlan,
  lateCheckout,
  handleLateCheckoutChange,
  mealPlans,
}: IActionsSectionProps) => {
  const { t } = useTranslation();

  return (
    <VStack spacing={4} bg="white" align="stretch" py={4} px={6}>
      <VStack align="stretch" overflowX="auto">
        <MealPlanSelector
          selectedMealPlan={selectedMealPlan}
          onMealPlanChange={updateMealPlan}
          mealPlans={mealPlans}
        />
      </VStack>

      <Checkbox
        size="lg"
        isChecked={lateCheckout}
        onChange={(e) => handleLateCheckoutChange(e.target.checked)}
      >
        <Flex align="center">
          {t`lateCheckoutFromHotel`}

          <Tooltip label={t`availableSeatsTooltip`}>
            <Flex justify="center" align="center">
              <Icon name="info-outline" size="16" color="gray.800" ml="1" />
            </Flex>
          </Tooltip>
        </Flex>
      </Checkbox>
    </VStack>
  );
};
