import { tagAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const helper = createMultiStyleConfigHelpers(tagAnatomy.keys)

const subtleSuccess = helper.definePartsStyle({
  container: {
    lineHeight: '16px',
    color: 'green.500',
    bgColor: 'green.50'
  }
})

const subtleWarning = helper.definePartsStyle({
  container: {
    lineHeight: '16px',
    color: 'orange.500',
    bgColor: 'orange.50'
  }
})

const tagComponentConfig = helper.defineMultiStyleConfig({
  baseStyle: {
    container: {
      py: 1,
      borderRadius: 'md',
      fontWeight: 'medium'
    }
  },
  sizes: {
    sm: {
      label: {
        px: 2,
        fontSize: '12px'
      }
    },
    md: {
      label: {
        px: 2,
        fontSize: '14px'
      }
    },
    lg: {
      label: {
        px: 3,
        fontSize: '16px'
      }
    }
  },
  variants: {
    'subtle-success': subtleSuccess,
    'subtle-warning': subtleWarning
  },
  defaultProps: {
    size: 'sm'
  }
})

export const tagComponentTheme = {
  Tag: tagComponentConfig
}
