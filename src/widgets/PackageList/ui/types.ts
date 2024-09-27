import { ReactNode } from 'react'

export type LayoutProps = {
	children: ReactNode | ReactNode[]
}

export type EmptyViewProps = {
	isLoadingFilteredPackages: boolean
	isSearchError: boolean
	isFilteredPackagesEmpty: boolean
}