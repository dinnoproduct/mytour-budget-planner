export const modalComponentTheme = {
  Modal: {
    baseStyle: {
      dialog: {
        rounded: { base: '0', md: 'lg' },
        boxShadow: 'none',
        overflow: 'hidden'
      }
    },
    sizes: {
      auth: {
        dialog: {
          maxW: { base: 'full', md: '402px' },
          width: 'full',
          height: { base: 'full', md: 'auto' }
        }
      },
      travelers: {
        dialog: {
          maxW: { base: 'full', md: '402px' },
          width: 'full',
          maxHeight: { base: 'full', md: '600px' },
          height: 'full'
        }
      },
      payment: {
        dialog: {
          maxW: { base: 'full', md: '402px' },
          width: 'full',
          maxHeight: { base: 'full', md: 'max-content' },
          height: 'full'
        }
      }
    }
  }
}
