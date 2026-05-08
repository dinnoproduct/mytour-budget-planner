"use client"

import React from "react"
import { Box } from "@chakra-ui/react"
import { useTranslation } from "react-i18next"
import { PageLayout } from "@/shared/ui/layout/PageLayout"
import { sectionsConfig } from "./config"
import { Section, SectionDivider, SectionItemRenderer } from "./components"

export const TermsPage = () => {
  const { t } = useTranslation()

  return (
    <PageLayout bg="white">
      <Box>
        {sectionsConfig.map((section) => (
          <React.Fragment key={section.titleKey}>
            <Section
              title={t(section.titleKey)}
              isFirst={section.isFirst}
              hideTitle={section.hideSectionTitle}
            >
              {section.items.map((item, itemIndex) => (
                <SectionItemRenderer
                  key={itemIndex}
                  item={item}
                  index={itemIndex}
                  t={t}
                />
              ))}
            </Section>
            {section.hasDividerAfter && <SectionDivider />}
          </React.Fragment>
        ))}
      </Box>
    </PageLayout>
  )
}
