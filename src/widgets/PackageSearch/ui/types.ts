import { type BoxProps, type StackProps } from '@chakra-ui/react'
import {Dispatch, type ReactNode, SetStateAction} from 'react'

export type PackageSearchProps = {
  variant?: PackageSearchVariant
  showTabs?: boolean
  isHotel?: number
  setHotel?: (index: number) => void
  initialTab?: number
} & Omit<LayoutProps, 'children'>

export type PackageSearchVariant = 'fixed' | 'centered' | 'fixedWithoutTabs' | 'centeredPackage' | 'centeredGroupTours'

export type LayoutProps = {
  containerProps?: BoxProps
  contentProps?: StackProps
  variant: PackageSearchVariant
  children: ReactNode | ReactNode[]
  defaultTabIndex?: number
  onTabChange?: (index: number) => void
  showTabs?: boolean
  className?: string
}
