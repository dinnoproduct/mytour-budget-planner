import { type ReactNode } from 'react'

export type LayoutProps = {
  children: ReactNode | ReactNode[]
}

export type EmptyStateProps = {
  isLoading?: boolean
}
