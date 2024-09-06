import { breakpoints } from '@foundation/ThemeProvider/theme'
import { useMediaQuery } from '@chakra-ui/react'

export const useBreakpoint = () => {
  const [isSm] = useMediaQuery(`(min-width: ${breakpoints.sm})`)
  const [isMd] = useMediaQuery(`(min-width: ${breakpoints.md})`)
  const [isLg] = useMediaQuery(`(min-width: ${breakpoints.lg})`)

  return {
    isSm,
    isMd,
    isLg
  }
}
