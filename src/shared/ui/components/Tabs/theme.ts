export const tabsComponentTheme = {
  Tabs: {
    variants: {
      brand: {
        tab: {
          fontWeight: 'medium',
          rounded: 'full',
          color: 'blue.500',
          bgColor: 'blue.50',
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
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
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
          border: 'none',
          bgColor: 'whiteAlpha.500',
          borderRadius: '200px',
          width: { base: 'full', md: 'fit-content' },
          px: 6,
          py: 4,
          transition: 'background-color 0.2s',
          _selected: {
            pointerEvents: 'none',
            bgColor: 'white',
            color: 'gray.700',
            borderRadius: '200px',
            svg: {
              color: 'gray.700'
            },
            '.tab-label': {
              color: 'gray.700'
            },
            '.cyprus-tab-icon': {
              color: 'gray.700',
            },
            '>': {
              color: 'gray.700'
            },
            _active: {
              bgColor: 'white'
            },
            _hover: {
              bgColor: 'white'
            },
            _focus: {
              bgColor: 'white'
            },
            _focusVisible: {
              bgColor: 'white',
              boxShadow: 'none'
            }
          },
          _hover: {
            _selected: {
              bgColor: 'white'
            },
            bgColor: 'whiteAlpha.600',
          },
          _active: {
            _selected: {
              bgColor: 'white'
            },
            bgColor: 'whiteAlpha.500'
          },
          p: {
            color: 'white'
          },
          svg: {
            color: 'white'
          },
          '.cyprus-tab-icon': {
            color: 'white',
          },
        },
        tablist: {
          mx: 4,
          gap: '4',
          borderBottom: 'none'
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
