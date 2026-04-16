import { toastStylesTheme } from '@ui'

const baseStyles = {
  'body, html': {
    bgColor: 'gray.50',
    m: 0,
    p: 0,
    fontFamily: 'heading'
  },
  ...toastStylesTheme
}

export default baseStyles
