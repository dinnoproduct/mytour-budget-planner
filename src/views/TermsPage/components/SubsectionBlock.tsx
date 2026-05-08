import React from "react"
import { Box, Text } from "@chakra-ui/react"
import type { SubsectionWithTitle, TextItem } from "../types"
import { SectionText } from "./SectionText"
import { BulletList } from "./BulletList"
import { NumberedList } from "./NumberedList"

interface SubsectionBlockProps {
  subsection: SubsectionWithTitle
  t: (key: string) => string
}

export const SubsectionBlock = ({ subsection, t }: SubsectionBlockProps) => {
  let content: React.ReactNode

  if (subsection.type === "bullet") {
    content = (
      <BulletList
        items={subsection.items as string[]}
        hasSpacing={subsection.hasSpacing ?? false}
        t={t}
      />
    )
  } else if (subsection.type === "ordered") {
    content = (
      <NumberedList
        items={subsection.items as string[]}
        hasSpacing={subsection.hasSpacing ?? false}
        t={t}
      />
    )
  } else {
    content = (
      <Box mb={subsection.hasSpacing ? 6 : 0}>
        {(typeof subsection.items[0] === "string"
          ? (subsection.items as string[]).filter((itemKey: string) => t(itemKey))
          : (subsection.items as TextItem[])
        ).map(
          (
            item: string | TextItem,
            index: number,
            array: (string | TextItem)[],
          ) => {
            const itemKey = typeof item === "string" ? item : item.key
            const spacing =
              typeof item === "string"
                ? index < array.length - 1
                : item.hasSpacing ?? false
            return (
              <SectionText
                key={itemKey}
                text={t(itemKey)}
                hasSpacing={spacing}
              />
            )
          },
        )}
      </Box>
    )
  }

  const isSubheading = subsection.headingStyle === "subheading"

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
  )
}
