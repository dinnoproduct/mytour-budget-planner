import { type PackageEntity } from '@entities/package'
import { type BoxProps } from '@chakra-ui/react'
import { type ReactNode, type RefObject } from 'react'

export type PriceSummaryCardProps = {
  tourPackage: PackageEntity
  containerRef?: RefObject<HTMLDivElement | null>
  contentType?: 'hotel' | 'package'
  buttonText?: string
} & BoxProps

export type LayoutProps = {
  children: ReactNode
  isFixed?: boolean
} & BoxProps
