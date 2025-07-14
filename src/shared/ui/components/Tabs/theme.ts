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
        tablist: {
          maxW: 'full',
          overflowX: 'auto',
          '&::-webkit-scrollbar': { display: 'none' },
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none'
        },
        tabpanel: {
          p: 0,
          pt: 10
        }
      },
      'grey-segment': {
        root: {
          height: { base: 'calc(100% - 64px)', md: 'auto' },
          pt: { base: 3, md: 0 }
        },
        tab: {
          fontWeight: '500',
          rounded: 'full',
          color: 'gray.600',
          px: 4,

          _selected: {
            fontWeight: '600',
            shadow: 'base',
            bgColor: '#fff',
          },
          _active: {
            bgColor: '#fff'
          }
        },
        tablist: {
          gap: '3',
          p: 1,
          mt: { md: 1 },
          mb: 1,
          mx: 'auto',
          width: 'fit-content',
          backgroundColor: 'gray.100',
          borderRadius: '100px',
        },
        tabpanels: {
          height: { base: 'calc(100% - 36px)', md: 'auto' }
        },
        tabpanel: {
          p: 0,
          height: 'full',
          maxHeight: 'full'
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
