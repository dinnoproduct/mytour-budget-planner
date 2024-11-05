import { ReactNode } from 'react'
import { TabsProps as ChakraTabsProps } from '@chakra-ui/react'

export type TabsProps = {
	labels: string[]
	children: ReactNode[] | ReactNode
} & ChakraTabsProps