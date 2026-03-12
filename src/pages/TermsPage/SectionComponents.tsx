import React from "react"
import {
  Box,
  Text,
  Divider,
  UnorderedList,
  OrderedList,
  ListItem,
} from "@chakra-ui/react"
import type { SectionItem, SubsectionWithTitle, TextItem } from "./types"

export const Section = ({
  title,
  isFirst = false,
  hideTitle = false,
  children,
}: {
  title: string
  isFirst?: boolean
  hideTitle?: boolean
  children: React.ReactNode
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
)

export const SectionText = ({
  text,
  hasSpacing = true,
}: {
  text: string
  hasSpacing?: boolean
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
)

export const SectionDivider = () => (
  <Box maxW="910px" mx="auto" px={4}>
    <Divider borderColor="gray.200" borderWidth="1px" my="40px" mx={0} />
  </Box>
)

const BulletList = ({
  items,
  hasSpacing = true,
  t,
}: {
  items: string[]
  hasSpacing?: boolean
  t: (key: string) => string
}) => (
  <UnorderedList mb={hasSpacing ? 6 : 0} spacing={0} pl={4}>
    {items.map((itemKey) => (
      <ListItem key={itemKey} mb={0}>
        <SectionText text={t(itemKey)} hasSpacing={false} />
      </ListItem>
    ))}
  </UnorderedList>
)

const NumberedList = ({
  items,
  hasSpacing = true,
  t,
}: {
  items: string[]
  hasSpacing?: boolean
  t: (key: string) => string
}) => (
  <OrderedList mb={hasSpacing ? 6 : 0} spacing={0} pl={4}>
    {items.map((itemKey) => (
      <ListItem key={itemKey} mb={0}>
        <SectionText text={t(itemKey)} hasSpacing={false} />
      </ListItem>
    ))}
  </OrderedList>
)

const SubsectionBlock = ({
  subsection,
  t,
}: {
  subsection: SubsectionWithTitle
  t: (key: string) => string
}) => {
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

export const SectionItemRenderer = ({
  item,
  index,
  t,
}: {
  item: SectionItem
  index: number
  t: (key: string) => string
}) => {
  if ("key" in item) {
    return (
      <SectionText
        key={`${item.key}-${index}`}
        text={t(item.key)}
        hasSpacing={item.hasSpacing ?? true}
      />
    )
  }
  if ("titleKey" in item) {
    return <SubsectionBlock subsection={item} t={t} />
  }
  if (item.type === "bullet") {
    return (
      <Box key={`bullet-${index}`}>
        <BulletList items={item.items} hasSpacing={item.hasSpacing ?? true} t={t} />
      </Box>
    )
  }
  if (item.type === "ordered") {
    return (
      <Box key={`ordered-${index}`}>
        <NumberedList items={item.items} hasSpacing={item.hasSpacing ?? true} t={t} />
      </Box>
    )
  }
  return null
}
