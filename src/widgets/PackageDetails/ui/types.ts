import { PackageEntity } from '@entities/package'
import { ReactNode, RefObject } from 'react'
import { BoxProps, ListProps } from '@chakra-ui/react'

export type PackageDetailsProps = {
	tourPackage: PackageEntity
	isLateCheckout: boolean
	containerRef?: RefObject<HTMLDivElement | null>
	detailsColumnRef?: RefObject<HTMLDivElement | null>
}

export type LayoutProps = {
	children: ReactNode
} & BoxProps

export type SectionLayoutProps = {
	children?: ReactNode
	/** Renders above the section title (same card) */
	beforeTitle?: ReactNode
	title?: ReactNode
	subtitle?: ReactNode
	listItems?: ListItem[]
} & BoxProps

export type SectionListProps = {
	listItems: ListItem[]
} & ListProps

type ListItem = {key: ReactNode, value: ReactNode}

export type CompanyPolicyViewProps = {
	parsedPolicy: {before: string; after: string; urlText: string, url?: string}
	cancelationPolicy: string
}
