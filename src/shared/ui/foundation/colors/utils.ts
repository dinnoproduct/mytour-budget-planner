import { colorsTheme } from './theme'

export const themeColor = (color: string) => {
  const colorPath = color.split('.')
  const colorValue = colorPath.reduce(
    (acc: any, cur: string) => acc[cur] || {},
    colorsTheme.colors
  )
  return typeof colorValue === 'string' ? colorValue : color
}

