import { type ReactNode } from 'react'
import { type TabsProps as ChakraTabsProps } from '@chakra-ui/react'

export type TabsProps = {
  labels: ReactNode[]
  children: ReactNode[] | ReactNode
  showTabs?: boolean
  align?: 'start' | 'end' | 'center'
} & ChakraTabsProps
