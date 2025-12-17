import { ReactNode } from 'react'

export interface ICompositionLayoutProps {
  children: ReactNode | ReactNode[]
  align?: 'start' | 'center' | 'end'
  direction?: 'row' | 'column'

  [key: string]: any
}
