import { PackageEntity } from '@entities/package'
import { BoxProps } from '@chakra-ui/react'
import { ReactNode, RefObject } from 'react'

export type PackageBookingConfigProps = {
	tourPackage: PackageEntity,
	onLateCheckoutChange?: (value: boolean) => void
	containerRef?: RefObject<HTMLDivElement>
	onBookClick?: () => void
} & BoxProps

export type LayoutProps = {
	children: ReactNode
	isFixed?: boolean
} & BoxProps

export type ConfigButtonProps = {
	title: string
	value: string
	onClick: () => void
}