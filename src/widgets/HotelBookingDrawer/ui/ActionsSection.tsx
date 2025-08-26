import { Flex, VStack } from "@chakra-ui/react";
import { Checkbox, Icon, Tooltip } from "@/shared/ui";
import { SectionLayout } from "../../HotelPackageDetails/ui/SectionLayout";
import { useTranslation } from "react-i18next";
import { IGeneratedMultivendorOffer } from "@/modules/packages/data/packagesTypes";
import { MealPlanSelector } from "./MealPlanSelector";

interface IActionsSectionProps {
    selectedMealPlan: number;
    updateMealPlan: (mealPlan: number) => void;
    generatedMultivendorOffers: IGeneratedMultivendorOffer[];
    lateCheckout: boolean;
    handleLateCheckoutChange: (value: boolean) => void;
}

export const ActionsSection = ({
    selectedMealPlan,
    updateMealPlan,
    generatedMultivendorOffers,
    lateCheckout,
    handleLateCheckoutChange
}: IActionsSectionProps) => {
    const { t } = useTranslation();

    return (
        <VStack bg="white" align="stretch" py={4} px={6}>
            <VStack align="stretch">
                <MealPlanSelector
                    selectedMealPlan={selectedMealPlan}
                    onMealPlanChange={updateMealPlan}
                    generatedMultivendorOffers={generatedMultivendorOffers}
                />
            </VStack>

            <SectionLayout gridArea="lateCheckout">
                <Checkbox
                    size="lg"
                    isChecked={lateCheckout}
                    onChange={e => handleLateCheckoutChange(e.target.checked)}
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
            </SectionLayout>
        </VStack>
    )
}