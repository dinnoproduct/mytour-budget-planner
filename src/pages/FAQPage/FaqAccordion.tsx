import { metaEvents } from "@/shared/configs/metaEvents";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FAQ_CATEGORIES, FAQCategory } from "./faqData";

type FaqEntry = { id: string; questionKey: string; answerKey: string };

type FaqAccordionProps = {
  faqs: FaqEntry[];
  categoryId?: FAQCategory;
  variant?: "desktop" | "mobile";
};

export const FaqAccordion = ({
  faqs,
  categoryId,
  variant = "desktop",
}: FaqAccordionProps) => {
  const { t } = useTranslation();

  // category_name: t(FAQ_CATEGORIES[category]),

  return (
    <Box
      bg={variant === "desktop" ? "gray.50" : undefined}
      p={variant === "desktop" ? 6 : 0}
      borderRadius={variant === "desktop" ? "xl" : undefined}
    >
      <Accordion allowMultiple={false} allowToggle={true} defaultIndex={0}>
        {faqs.map((faq) => (
          <AccordionItem
            key={faq.id}
            border="none"
            borderBottom="1px solid"
            borderColor="gray.200"
            _last={{ borderBottom: "none", mb: 0 }}
            pt={0}
            pb={6}
            mb={6}
          >
            <AccordionButton
              px={0}
              py={2}
              _hover={{ bg: "transparent" }}
              justifyContent="space-between"
              onClick={() => {
                if (categoryId){
                  metaEvents.faqItemOpened({
                    category_id: categoryId,
                    item_id: faq.id,
                    category_name: t(FAQ_CATEGORIES[categoryId as FAQCategory]),
                    item_name: t(faq.questionKey),
                  });}
              }}
            >
              <Text
                as="span"
                fontWeight={600}
                fontSize="16px"
                lineHeight="24px"
                color="gray.700"
                textAlign="left"
                pr={4}
                flex={1}
              >
                {t(faq.questionKey)}
              </Text>
              <AccordionIcon color="blue.500" />
            </AccordionButton>
            <AccordionPanel px={0} py={0} mt={2.5}>
              <Text fontSize="14px" lineHeight="20px" color="gray.700">
                {t(faq.answerKey)}
              </Text>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
};
