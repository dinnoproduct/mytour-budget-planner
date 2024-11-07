export const inputComponentTheme = {
  Input: {
    variants: {
      brand: {
        field: {
          maxW: 'full',
          width: 'full',
          color: 'blackAlpha.900',
          backgroundColor: 'white',
          border: '1px solid',
          borderColor: 'gray.400',
          rounded: 'lg',
          fontFamily: 'heading',
          fontWeight: 'normal',
          fontSize: 'text-sm',
          lineHeight: 'text-sm',
          px: '3',
          _placeholder: {
            color: 'gray.500'
          },
          _hover: {
            borderColor: 'blue.600',
            _placeholder: {
              color: 'gray.500'
            }
          },
          _focus: {
            borderColor: 'blue.500'
          },
          _focusVisible: {
            borderColor: 'blue.500'
          },
          _disabled: {
            borderColor: 'gray.300',
            opacity: '1',
            color: 'gray.400',
            _placeholder: {
              color: 'gray.400'
            },
            _hover: {
              borderColor: 'gray.300'
            }
          }
        }
      }
    },
    defaultProps: {
      variant: 'brand',
      size: 'lg'
    }
  }
}
