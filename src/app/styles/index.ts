import baseStyles from './base'
import { extendTheme } from '@chakra-ui/react'
import { theme } from '@foundation/ThemeProvider'

export const chakraTheme = extendTheme({
	...theme,
	styles: {
		global: {
			...theme.styles.global,
			...baseStyles
		}
	},
	components: {
		...theme.components
	}
})

