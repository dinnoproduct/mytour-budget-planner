import { defineStyleConfig } from '@chakra-ui/react'

export const RadioCard = defineStyleConfig({
  baseStyle: {
    color: 'gray.600',
    border: '1px solid',
    borderColor: 'gray.300',
    cursor: 'pointer',
    fontWeight: 'medium',
    display: 'flex',
    '& > #supLabel, & > #icon *:last-of-type': {
      fontSize: '2xs',
      color: 'gray.500'
    },
    _hover: {
      bgColor: 'gray.50'
    },
    _disabled: {
      cursor: 'not-allowed',
      opacity: 0.4,
      _hover: {
        bgColor: 'transparent'
      }
    },
    _checked: {
      color: 'white',
      fontWeight: 'semibold',
      bgColor: 'blue.500',
      border: '1px solid',
      borderColor: 'blue.500',
      boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.1)',
      '& > #supLabel, & > #icon *:last-of-type': {
        color: 'white'
      },

      _hover: {
        bgColor: 'blue.500'
      }
    }
  },
  variants: {
    outline: {
      borderRadius: '100px',
      '& > *:last-of-type': {
        alignSelf: 'center',
        marginLeft: '2px'
      }
    },
    'outline-card': {
      color: 'gray.700',
      height: '100px',
      borderRadius: 'lg',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: 1,
      '& > #label': {
        mt: 2,
        mb: 0.5
      }
    }
  },
  sizes: {
    sm: {
      fontSize: 'sm',
      px: 4,
      py: 1
    },
    md: {
      fontSize: 'sm',
      px: 4,
      py: 2
    },
    lg: {
      fontSize: 'lg',
      px: 4,
      py: 3
    },
    'outline-card-sm': {
      borderRadius: 'lg',
      p: 8,
      fontSize: 14,
      fontWeight: 'semibold',
      width: '95px',
      '& > #icon, & > #icon > svg': {
        width: '16px !important',
        height: '16px !important'
      }
    },
    'outline-card-md': {
      borderRadius: 'xl',
      fontSize: 14,
      fontWeight: 'semibold',
      py: '23px',
      px: 8,
      width: '100px',
      '& > #icon, & > #icon > svg': {
        width: '24px !important',
        height: '24px !important'
      }
    },
    'outline-card-lg': {
      fontSize: 14,
      fontWeight: 'semibold',
      borderRadius: '2xl',
      p: 8,
      width: '104px',
      '& > #icon, & > #icon > svg': {
        width: '24px !important',
        height: '24px !important'
      }
    }
  },
  defaultProps: {
    variant: 'outline',
    size: 'md'
  }
})

export const radioSelectComponentTheme = {
  RadioCard
}
