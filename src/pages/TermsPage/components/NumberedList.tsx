import { OrderedList, ListItem } from "@chakra-ui/react"
import { SectionText } from "./SectionText"

interface NumberedListProps {
  items: string[]
  hasSpacing?: boolean
  t: (key: string) => string
}

export const NumberedList = ({ items, hasSpacing = true, t }: NumberedListProps) => (
  <OrderedList mb={hasSpacing ? 6 : 0} spacing={0} pl={4}>
    {items.map((itemKey) => (
      <ListItem key={itemKey} mb={0}>
        <SectionText text={t(itemKey)} hasSpacing={false} />
      </ListItem>
    ))}
  </OrderedList>
)
