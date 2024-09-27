import baseStyles from './base'
import { extendTheme } from '@chakra-ui/react'
import { theme } from '@foundation/ThemeProvider'
import { tooltipStylesTheme } from '@components/Tooltip'

export const chakraTheme = extendTheme({
	...theme,
	styles: {
		global: {
			...theme.styles.global,
			...baseStyles,
			...tooltipStylesTheme,
		}
	},
	components: {
		...theme.components
	}
})

