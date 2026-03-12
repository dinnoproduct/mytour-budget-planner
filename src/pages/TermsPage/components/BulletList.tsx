import { UnorderedList, ListItem } from "@chakra-ui/react"
import { SectionText } from "./SectionText"

interface BulletListProps {
  items: string[]
  hasSpacing?: boolean
  t: (key: string) => string
}

export const BulletList = ({ items, hasSpacing = true, t }: BulletListProps) => (
  <UnorderedList mb={hasSpacing ? 6 : 0} spacing={0} pl={4}>
    {items.map((itemKey) => (
      <ListItem key={itemKey} mb={0}>
        <SectionText text={t(itemKey)} hasSpacing={false} />
      </ListItem>
    ))}
  </UnorderedList>
)
