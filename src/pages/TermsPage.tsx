import React from "react";
import { Box, Text, Divider, UnorderedList, OrderedList, ListItem } from "@chakra-ui/react";
import { Footer } from "@ui";
import { Header } from "@widgets/Header";
import { useTranslation } from "react-i18next";

interface TextItem {
  key: string;
  type: "text";
  hasSpacing?: boolean; // Whether to add spacing after this text item
}

interface BulletListSubsection {
  type: "bullet";
  items: string[];
  hasSpacing?: boolean;
}

interface OrderedListSubsection {
  type: "ordered";
  items: string[];
  hasSpacing?: boolean;
}

interface SubsectionWithTitle {
  titleKey: string;
  type: "text" | "bullet" | "ordered";
  items: string[] | TextItem[];
  hasSpacing?: boolean;
  headingStyle?: "section" | "subheading"; // "section" = h3 (20px), "subheading" = smaller (16px)
}

type SectionItem =
  | TextItem
  | BulletListSubsection
  | OrderedListSubsection
  | SubsectionWithTitle;

interface SectionConfig {
  titleKey: string;
  isFirst: boolean;
  items: SectionItem[];
  hasDividerAfter?: boolean;
  hideSectionTitle?: boolean; // If true, don't render the section title (for subsections that start with subheadings)
}

const sectionsConfig: SectionConfig[] = [
  {
    titleKey: "terms.title",
    isFirst: true,
    items: [
      { key: "terms.welcome", type: "text", hasSpacing: false },
      { key: "terms.agreement", type: "text", hasSpacing: false },
      { key: "terms.policyIntro", type: "text", hasSpacing: false },
    ],
    hasDividerAfter: false,
  },
  {
    titleKey: "terms.booking.title",
    isFirst: false,
    items: [
      { key: "terms.booking.intro", type: "text", hasSpacing: true },
      {
        type: "ordered",
        items: [
          "terms.booking.mytourConditions",
          "terms.booking.providerConditions",
        ],
        hasSpacing: true,
      },
      { key: "terms.booking.thirdParty", type: "text", hasSpacing: false },
      {
        type: "bullet",
        items: [
          "terms.booking.thirdParty.cancellation",
          "terms.booking.thirdParty.booking",
          "terms.booking.thirdParty.services",
        ],
        hasSpacing: true,
      },
      { key: "terms.booking.specificTerms", type: "text", hasSpacing: false },
    ],
    hasDividerAfter: true,
  },
  {
    titleKey: "terms.payments.title",
    isFirst: false,
    items: [
      { key: "terms.payments.booking", type: "text", hasSpacing: false },
      {
        type: "bullet",
        items: [
          "terms.payments.booking.payment",
          "terms.payments.booking.cancellation",
        ],
        hasSpacing: true,
      },
      {
        titleKey: "terms.payments.refund.title",
        type: "text",
        items: [
          {
            key: "terms.payments.refund.text",
            type: "text",
            hasSpacing: false,
          },
          {
            key: "terms.payments.refund.conditions",
            type: "text",
            hasSpacing: false,
          },
        ],
        hasSpacing: false,
        headingStyle: "subheading",
      },
      {
        titleKey: "terms.traveler.title",
        type: "text",
        items: ["terms.traveler.confirmation"],
        hasSpacing: false,
        headingStyle: "subheading",
      },
      {
        type: "bullet",
        items: [
          "terms.traveler.confirmation.age",
          "terms.traveler.confirmation.requirements",
          "terms.traveler.confirmation.terms",
        ],
        hasSpacing: false,
      },
    ],
    hasDividerAfter: true,
  },
  {
    titleKey: "terms.personalData.title",
    isFirst: false,
    items: [
      { key: "terms.personalData.intro", type: "text", hasSpacing: true },
      {
        type: "bullet",
        items: [
          "terms.personalData.collected",
          "terms.personalData.collected.contact",
          "terms.personalData.collected.travel",
          "terms.personalData.collected.others",
        ],
        hasSpacing: true,
      },
      {
        titleKey: "terms.personalData.access.title",
        type: "bullet",
        items: [
          "terms.personalData.access.providers",
          "terms.personalData.access.payment",
          "terms.personalData.access.partners",
        ],
        hasSpacing: true,
        headingStyle: "subheading",
      },
      { key: "terms.personalData.sharing", type: "text", hasSpacing: true },
      { key: "terms.personalData.usage", type: "text", hasSpacing: false },
      {
        type: "bullet",
        items: [
          "terms.personalData.usage.management",
          "terms.personalData.usage.contact",
          "terms.personalData.usage.offers",
        ],
        hasSpacing: false,
      },
    ],
    hasDividerAfter: true,
  },
  {
    titleKey: "terms.liability.title",
    isFirst: false,
    items: [
      { key: "terms.liability.intro", type: "text", hasSpacing: false },
      {
        type: "bullet",
        items: ["terms.liability.responsibility"],
        hasSpacing: false,
      },
    ],
    hasDividerAfter: true,
  },
  {
    titleKey: "terms.updates.title",
    isFirst: false,
    items: [{ key: "terms.updates.text", type: "text", hasSpacing: false }],
    hasDividerAfter: true,
  },
  {
    titleKey: "terms.support.title",
    isFirst: false,
    items: [
      { key: "terms.support.intro", type: "text", hasSpacing: false },
      {
        type: "text",
        key: "terms.support.helpCenter",
        hasSpacing: false,
      },
      {
        type: "text",
        key: "terms.support.contact",
        hasSpacing: false,
      },
    ],
    hasDividerAfter: false,
  },
];

export const TermsPage = () => {
  const { t } = useTranslation();

  const Section = ({
    title,
    isFirst = false,
    hideTitle = false,
    children,
  }: {
    title: string;
    isFirst?: boolean;
    hideTitle?: boolean;
    children: React.ReactNode;
  }) => (
    <Box
      bg={isFirst ? "gray.50" : "transparent"}
      py={isFirst ? { base: 6, md: 8 } : 0}
    >
      <Box maxW="910px" mx="auto" mt={8} px={4}>
        {!hideTitle && (
          <Text
            as="h2"
            fontSize={isFirst ? "30px" : "20px"}
            fontWeight={700}
            lineHeight={isFirst ? "133%" : "120%"}
            color="gray.800"
            mb="24px"
          >
            {title}
          </Text>
        )}
        <Box mt={0}>{children}</Box>
      </Box>
    </Box>
  );

  const SectionText = ({
    text,
    hasSpacing = true,
  }: {
    text: string;
    hasSpacing?: boolean;
  }) => (
    <Text
      fontSize="14px"
      fontWeight={500}
      lineHeight="20px"
      color="gray.700"
      mb={hasSpacing ? 6 : 0}
    >
      {text}
    </Text>
  );

  const SectionDivider = () => (
    <Box maxW="910px" mx="auto" px={4}>
      <Divider borderColor="gray.200" borderWidth="1px" my="40px" mx={0} />
    </Box>
  );

  const renderBulletList = (items: string[], hasSpacing: boolean = true) => (
    <UnorderedList mb={hasSpacing ? 6 : 0} spacing={0} pl={4}>
      {items.map((itemKey) => (
        <ListItem key={itemKey} mb={0}>
          <SectionText text={t(itemKey)} hasSpacing={false} />
        </ListItem>
      ))}
    </UnorderedList>
  );

  const renderOrderedList = (items: string[], hasSpacing: boolean = true) => (
    <OrderedList mb={hasSpacing ? 6 : 0} spacing={0} pl={4}>
      {items.map((itemKey) => (
        <ListItem key={itemKey} mb={0}>
          <SectionText text={t(itemKey)} hasSpacing={false} />
        </ListItem>
      ))}
    </OrderedList>
  );

  const renderSubsectionWithTitle = (subsection: SubsectionWithTitle) => {
    const content =
      subsection.type === "bullet" ? (
        renderBulletList(
          subsection.items as string[],
          subsection.hasSpacing ?? false,
        )
      ) : subsection.type === "ordered" ? (
        renderOrderedList(
          subsection.items as string[],
          subsection.hasSpacing ?? false,
        )
      ) : (
        <Box mb={subsection.hasSpacing ? 6 : 0}>
          {(typeof subsection.items[0] === "string"
            ? (subsection.items as string[]).filter((itemKey: string) =>
                t(itemKey),
              )
            : (subsection.items as TextItem[])
          ).map(
            (
              item: string | TextItem,
              index: number,
              array: (string | TextItem)[],
            ) => {
              const itemKey = typeof item === "string" ? item : item.key;
              const hasSpacing =
                typeof item === "string"
                  ? index < array.length - 1
                  : item.hasSpacing ?? false;
              return (
                <SectionText
                  key={itemKey}
                  text={t(itemKey)}
                  hasSpacing={hasSpacing}
                />
              );
            },
          )}
        </Box>
      );

    const isSubheading = subsection.headingStyle === "subheading";

    return (
      <Box key={subsection.titleKey}>
        <Text
          as={isSubheading ? "h4" : "h3"}
          fontSize={isSubheading ? "16px" : "20px"}
          fontWeight={isSubheading ? 600 : 700}
          lineHeight={isSubheading ? "150%" : "120%"}
          color="gray.800"
          my={6}
        >
          {t(subsection.titleKey)}
        </Text>
        {content}
      </Box>
    );
  };

  const renderSectionItem = (item: SectionItem, index: number) => {
    if ("key" in item) {
      // TextItem
      return (
        <SectionText
          key={`${item.key}-${index}`}
          text={t(item.key)}
          hasSpacing={item.hasSpacing ?? true}
        />
      );
    } else if ("titleKey" in item) {
      // SubsectionWithTitle
      return renderSubsectionWithTitle(item);
    } else if (item.type === "bullet") {
      // BulletListSubsection
      return (
        <Box key={`bullet-${index}`}>
          {renderBulletList(item.items, item.hasSpacing ?? true)}
        </Box>
      );
    } else if (item.type === "ordered") {
      // OrderedListSubsection
      return (
        <Box key={`ordered-${index}`}>
          {renderOrderedList(item.items, item.hasSpacing ?? true)}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box overflowX="hidden" bg="white">
      <Header />
      <Box>
        {sectionsConfig.map((section, sectionIndex) => (
          <React.Fragment key={section.titleKey}>
            <Section
              title={t(section.titleKey)}
              isFirst={section.isFirst}
              hideTitle={section.hideSectionTitle}
            >
              {section.items.map((item, itemIndex) =>
                renderSectionItem(item, itemIndex),
              )}
            </Section>
            {section.hasDividerAfter && <SectionDivider />}
          </React.Fragment>
        ))}
      </Box>
      <Footer />
    </Box>
  );
};
