export const containerComponentTheme = {
  Container: {
    variants: {
      brand: {
        px: { base: 4, md: 6, lg: 8 },
        maxWidth: '1440px',
        // Runtime check to use dvw or fallback to dw
        '@supports (width: 100dvw)': {
          maxWidth: 'min(1440px, 100dvw)'
        },
        '@supports not (width: 100dvw)': {
          maxWidth: 'min(1440px, 100vw)'
        }
      }
    },
    defaultProps: {
      variant: 'brand'
    }
  }
}
