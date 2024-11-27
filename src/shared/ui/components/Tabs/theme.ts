export const tabsComponentTheme = {
  Tabs: {
    variants: {
      brand: {
        tab: {
          fontWeight: 'medium',
          rounded: 'full',
          bgColor: 'blue.50',
          color: 'blue.500',
          px: 4,
          mr: 3,
          _selected: {
            bgColor: 'blue.500',
            color: 'white'
          }
        },
        tabpanel: {
          p: 0,
          pt: 10
        }
      },
      line: {
        tab: {
          fontWeight: 'medium',
          // rounded: 'full',
          // bgColor: 'blue.50',
          color: 'gray.700',
          px: 4,
          py: 2,
          mr: 3,
          _selected: {
            // bgColor: 'blue.500',
            color: 'blue.500 !important',
            svg: {
              color: 'blue.500'
            },
            '.tab-label': {
              color: 'blue.500'
            },
            '>': {
              color: 'blue.500'
            }
          },
          _active: {
            bgColor: 'transparent'
          }
        },
        tablist: {
          borderBottom: '1px solid',
          borderColor: 'gray.100'
        },
        tabpanel: {
          p: 0,
          pt: 6
        }
      }
    },
    sizes: {
      sm: {
        tab: {
          height: '28px',
          fontSize: 'text-sm',
          lineHeight: 'text-sm'
        }
      },
      md: {
        tab: {
          height: '40px',
          fontSize: 'text-md',
          lineHeight: 'text-md'
        }
      },
      lg: {
        tab: {
          height: '52px',
          fontSize: 'text-lg',
          lineHeight: 'text-lg'
        }
      }
    },
    defaultProps: {
      variant: 'brand',
      size: 'md'
    }
  }
}
