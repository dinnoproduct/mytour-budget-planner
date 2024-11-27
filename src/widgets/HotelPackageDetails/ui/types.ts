import { type PackageEntity } from '@entities/package'
import { type ReactNode } from 'react'
import { type BoxProps, type ListProps } from '@chakra-ui/react'

export type PackageDetailsProps = {
  tourPackage: PackageEntity
}

export type LayoutProps = {
  children: ReactNode
} & BoxProps

export type SectionLayoutProps = {
  children?: ReactNode
  title?: ReactNode
  subtitle?: ReactNode
  listItems?: ListItem[]
} & BoxProps

export type SectionListProps = {
  listItems: ListItem[]
} & ListProps

type ListItem = { key: ReactNode; value: ReactNode }

export type CompanyPolicyViewProps = {
  parsedPolicy: { before: string; after: string; urlText: string; url?: string }
  cancelationPolicy: string
}
