import { BoxProps, StackProps } from '@chakra-ui/react'
import { ReactNode } from 'react'

export type PackageSearchProps = {
	variant?: PackageSearchVariant
} & Omit<LayoutProps, 'children'>

export type PackageSearchVariant = 'fixed' | 'centered'

export type LayoutProps = {
	containerProps?: BoxProps
	contentProps?: StackProps,
	variant: PackageSearchVariant
	children: ReactNode | ReactNode[]
}

export type SearchCitiesProps = {
	defaultSelectedCities?: number[]
	onChange?: (cities: number[]) => void
}

export type SearchTravelersProps = {
	defaultData?: SearchTravelersData,
	onChange?: (data: SearchTravelersData) => void
}

export type SearchTravelersData = {
	childrenCount: number
	adultsCount: number
	childrenAges: number[]
}