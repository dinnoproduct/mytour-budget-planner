import { type ReactNode } from 'react'

export type LayoutProps = {
  children: ReactNode | ReactNode[]
  hasCompareFooter?: boolean
}

export type EmptyViewProps = {
  searchView: 'hotel' | 'packages' | 'filter-packages' | 'filter-hotel'
}
