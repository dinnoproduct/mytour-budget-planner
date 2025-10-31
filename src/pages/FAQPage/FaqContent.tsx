import { Box, Flex, useMediaQuery } from "@chakra-ui/react";
import { metaEvents } from "@/shared/configs/metaEvents";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import {
  FAQ_CATEGORIES,
  getAllCategories,
  getFAQsByCategory,
  type FAQCategory,
} from "./faqData";
import { CategoriesSidebar } from "./CategoriesSidebar";
import { FaqAccordion } from "./FaqAccordion";
import { MobileCategoriesList } from "./MobileCategoriesList";
import { MobileQAView } from "./MobileQAView";

type FaqContentProps = {
  onMobileCategoryOpenChange?: (open: boolean) => void;
};

export const FaqContent = ({ onMobileCategoryOpenChange }: FaqContentProps) => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] =
    useState<FAQCategory>("aboutPlatform");
  const categories = getAllCategories();
  const faqs = getFAQsByCategory(selectedCategory);
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [isMobileQuestionsOpen, setIsMobileQuestionsOpen] = useState(false);

  useEffect(() => {
    onMobileCategoryOpenChange &&
      onMobileCategoryOpenChange(Boolean(isMobile && isMobileQuestionsOpen));
  }, [isMobile, isMobileQuestionsOpen, onMobileCategoryOpenChange]);

  const handleCategoryClick = (category: FAQCategory) => {
    setSelectedCategory(category);
    metaEvents.faqCategorySelected({
      category_id: category,
      category_name: t(FAQ_CATEGORIES[category]),
    });
    if (isMobile) {
      setIsMobileQuestionsOpen(true);
    }
  };

  return (
    <Box
      width="full"
      px={{ base: 0, sm: 6 }}
      pt={{ base: isMobileQuestionsOpen ? 32 : 10, sm: "60px" }}
      pb={{ base: 20, md: "100px" }}
      bgColor="white"
      mt="-120px"
      position="relative"
      zIndex={2}
      borderTopLeftRadius="40px"
      borderTopRightRadius="40px"
    >
      {!isMobile ? (
        <Flex
          direction="row"
          gap={{ base: 6, md: 8 }}
          align="flex-start"
          maxW={{ base: "100%", md: "100%", lg: "75%" }}
          mx="auto"
        >
          <CategoriesSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={handleCategoryClick}
          />
          <Box flex={1} width="full">
            <FaqAccordion faqs={faqs} categoryId={selectedCategory} variant="desktop" />
          </Box>
        </Flex>
      ) : (
        <Box maxW="600px" mx="auto" width="full">
          {!isMobileQuestionsOpen ? (
            <MobileCategoriesList
              categories={categories}
              onSelect={handleCategoryClick}
            />
          ) : (
            <MobileQAView
              category={selectedCategory}
              faqs={faqs}
              onBack={() => setIsMobileQuestionsOpen(false)}
            />
          )}
        </Box>
      )}
    </Box>
  );
};
