import { type PackageEntity } from '@entities/package'
import { type BoxProps } from '@chakra-ui/react'
import { type ReactNode, type RefObject } from 'react'

export type PackageBookingConfigProps = {
  tourPackage: PackageEntity
  onLateCheckoutChange?: (value: boolean) => void
  containerRef?: RefObject<HTMLDivElement>
  onBookClick?: (data: BookData) => void
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

type BookData = {
  childrenAges: number[]
}
