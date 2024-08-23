export const formComponentsTheme = {
  FormLabel: {
    variants: {
      brand: {
        color: 'blackAlpha.900',
        fontFamily: 'heading',
        fontSize: 'text-sm',
        lineHeight: 'text-sm',
        fontWeight: 'normal',
        mb: '2',
        _disabled: {
          opacity: '1',
          color: 'gray.400'
        }
      }
    },
    defaultProps: {
      variant: 'brand'
    }
  }
}
