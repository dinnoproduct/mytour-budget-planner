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