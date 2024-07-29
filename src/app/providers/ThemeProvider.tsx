import { ChakraProvider } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { chakraTheme } from '../styles'

export type Props = {
	children?: ReactNode | ReactNode[]
}

export const ThemeProvider = ({ children }: Props) => (
	<ChakraProvider theme={chakraTheme}>{children}</ChakraProvider>
)

