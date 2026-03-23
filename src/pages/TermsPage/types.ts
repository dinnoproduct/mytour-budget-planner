export interface TextItem {
  key: string
  type: "text"
  hasSpacing?: boolean
}

export interface BulletListSubsection {
  type: "bullet"
  items: string[]
  hasSpacing?: boolean
}

export interface OrderedListSubsection {
  type: "ordered"
  items: string[]
  hasSpacing?: boolean
}

export interface SubsectionWithTitle {
  titleKey: string
  type: "text" | "bullet" | "ordered"
  items: string[] | TextItem[]
  hasSpacing?: boolean
  headingStyle?: "section" | "subheading"
}

export type SectionItem =
  | TextItem
  | BulletListSubsection
  | OrderedListSubsection
  | SubsectionWithTitle

export interface SectionConfig {
  titleKey: string
  isFirst: boolean
  items: SectionItem[]
  hasDividerAfter?: boolean
  hideSectionTitle?: boolean
}
