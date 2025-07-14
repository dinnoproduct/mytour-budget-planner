import { type BoxProps, type StackProps } from '@chakra-ui/react'
import { type ReactNode } from 'react'

export type PackageSearchProps = {
  variant?: PackageSearchVariant
  showTabs?: boolean
} & Omit<LayoutProps, 'children'>

export type PackageSearchVariant = 'fixed' | 'centered' | 'fixedWithoutTabs'

export type LayoutProps = {
  containerProps?: BoxProps
  contentProps?: StackProps
  variant: PackageSearchVariant
  children: ReactNode | ReactNode[]
  defaultTabIndex?: number
  onTabChange?: (index: number) => void
  showTabs?: boolean
}
