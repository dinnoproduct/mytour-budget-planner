import { extendTheme } from '@chakra-ui/react'
import { colorsTheme } from '@foundation/colors'
import {
  typographyComponentTheme,
  typographyTheme
} from '@foundation/typography'

export const theme = extendTheme({
  ...colorsTheme,
  ...typographyTheme,
  components: {
    ...typographyComponentTheme,
  }
})
