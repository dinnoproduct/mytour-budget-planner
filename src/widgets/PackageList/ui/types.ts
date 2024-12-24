import { type ReactNode } from 'react'

export type LayoutProps = {
  children: ReactNode | ReactNode[]
}

export type EmptyViewProps = {
  searchView: 'hotel' | 'packages'
}
