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
import { menuComponentTheme } from '@components/Menu/theme'
import { tooltipComponentTheme } from '@components/Tooltip'
import { modalComponentTheme } from '@components/Modal/theme'
import { tabsComponentTheme } from '@components/Tabs'
import { containerComponentTheme } from '@components/Container/theme'
import { radioComponentTheme } from '@components/Radio/theme'
import { radioSelectComponentTheme } from '@components/RadioCard/theme'
import { tagComponentTheme } from '@components/Tag/theme'

export const breakpoints = {
  base: '0px',
  xs: '576px',
  sm: '768px',
  smd: '1024px',
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
    ...tooltipComponentTheme,
    ...modalComponentTheme,
    ...tabsComponentTheme,
    ...containerComponentTheme,
    ...radioComponentTheme,
    ...radioSelectComponentTheme,
    ...tagComponentTheme
  }
})
