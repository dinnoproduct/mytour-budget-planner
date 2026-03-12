import { Box } from "@chakra-ui/react"
import type { SectionItem } from "../types"
import { SectionText } from "./SectionText"
import { BulletList } from "./BulletList"
import { NumberedList } from "./NumberedList"
import { SubsectionBlock } from "./SubsectionBlock"

interface SectionItemRendererProps {
  item: SectionItem
  index: number
  t: (key: string) => string
}

export const SectionItemRenderer = ({ item, index, t }: SectionItemRendererProps) => {
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
