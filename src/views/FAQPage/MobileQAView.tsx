import { Box, Text, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { type FAQCategory, FAQ_CATEGORIES } from "./faqData";
import { FaqAccordion } from "./FaqAccordion";
import { Button } from "@/shared/ui";

type MobileQAViewProps = {
  category: FAQCategory;
  faqs: { id: string; questionKey: string; answerKey: string }[];
  onBack: () => void;
};

export const MobileQAView = ({ category, faqs, onBack }: MobileQAViewProps) => {
  const { t } = useTranslation();
  return (
    <Box px={4} pt={4}>
      <Button
        variant="text-blue"
        iconBefore="arrow-back"
        onClick={onBack}
        px={0}
      >
        <Text color="blue.600">{t("faq.back")}</Text>
      </Button>
      <Heading as="h3" fontSize="18px" color="gray.900" pt={4} pb={6}>
        {t(FAQ_CATEGORIES[category])}
      </Heading>
      <Box bg="gray.50" px={4} py={6} borderRadius="xl">
        <FaqAccordion faqs={faqs} categoryId={category} variant="mobile" />
      </Box>
    </Box>
  );
};
