import { type ReactNode } from 'react'

export type LayoutProps = {
  children: ReactNode | ReactNode[]
}

export type EmptyStateProps = {
  isLoading?: boolean
}

export enum RequestsGroupStatus {
  Upcoming = 'upcoming',
  Incomplete = 'incomplete',
  Past = 'past',
  Canceled = 'canceled'
}
