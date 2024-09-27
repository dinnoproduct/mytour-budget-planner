import { extendTheme } from '@chakra-ui/react'
import { colorsTheme } from '@foundation/Colors'
import {
	typographyComponentTheme,
	typographyTheme
} from '@foundation/Typography'
import { avatarComponentTheme } from '@components/Avatar'
import { checkboxComponentTheme } from '@components/Checkbox'
import { alertComponentTheme } from '@components/Alert'
import { buttonComponentTheme } from '@components/Button'
import { inputComponentTheme } from '@components/Input'
import { formComponentsTheme } from '@components/Form'
import { menuComponentTheme } from '@components/Menu/theme.ts'
import { tooltipComponentTheme } from '@components/Tooltip'

export const breakpoints = {
	base: '0px',
	sm: '768px',
	md: '1280px',
	lg: '1440px'
}

export const theme = extendTheme({
	...colorsTheme,
	...typographyTheme,
	breakpoints,
	components: {
		...typographyComponentTheme,
		...avatarComponentTheme,
		...checkboxComponentTheme,
		...alertComponentTheme,
		...buttonComponentTheme,
		...inputComponentTheme,
		...formComponentsTheme,
		...menuComponentTheme,
		...tooltipComponentTheme
	}
})
