const svgArrow =
  "url(\"/assets/icons/tooltipArrow.svg\") !important"

export const tooltipComponentTheme = {
  Tooltip: {
    baseStyle: {
      bgColor: 'gray.900',
      color: 'white',
      fontFamily: 'body',
      fontWeight: 'normal',
      rounded: 'base',
      boxShadow: 'none',
      fontSize: 'text-sm',
      lineHeight: 'text-sm',
      px: '3',
      py: '2'
    },
    sizes: {
      // lg: {
      //   fontSize: 'paragraph-base',
      //   lineHeight: 'paragraph-base',
      //   p: 'spacing-03'
      // },
      md: {
        fontSize: 'text-sm',
        lineHeight: 'text-sm',
        px: '3',
        py: '2'
      },
      // sm: {
      //   fontSize: 'paragraph-xs',
      //   lineHeight: 'paragraph-xs',
      //   px: 'spacing-03',
      //   py: 'spacing-02',
      //   '--my-tooltip-arrow-width': '8px',
      //   '--my-tooltip-arrow-height': '2px',
      //   '--my-tooltip-arrow-top-transform': 'translate(-150%, -35%)',
      //   '--my-tooltip-arrow-bottom-transform': 'translate(150%, 35%)',
      //   '--my-tooltip-arrow-horizontal-space': 'var(--chakra-space-spacing-03)',
      //   '.chakra-tooltip__arrow': {
      //     content: svgArrowSm
      //   }
      // }
    },
    defaultProps: {
      size: 'md'
    }
  }
}

export const tooltipStylesTheme = {
  ':root': {
    '--my-tooltip-arrow-width': '20px',
    '--my-tooltip-arrow-height': '10px',
    '--my-tooltip-arrow-top-transform': 'translate(-100%, -30%)',
    '--my-tooltip-arrow-bottom-transform': 'translate(100%, 30%)',
    '--my-tooltip-arrow-horizontal-space': 'var(--chakra-space-4)'
  },
  '.chakra-tooltip__arrow': {
    boxShadow: 'none !important',
    background: 'transparent !important',
    content: svgArrow
  },
  '[data-popper-placement^="bottom"]': {
    '.chakra-tooltip__arrow': {
      transform:
        'rotate(270deg) var(--my-tooltip-arrow-bottom-transform) !important',
      width: 'var(--my-tooltip-arrow-height) !important',
      height: 'var(--my-tooltip-arrow-width) !important'
    },
    '.chakra-tooltip__arrow-wrapper': {
      top: '0 !important',
      width: 'var(--my-tooltip-arrow-width) !important',
      height: 'var(--my-tooltip-arrow-height) !important'
    }
  },
  '[data-popper-placement="bottom-start"], [data-popper-placement="bottom-end"]':
    {
      '.chakra-tooltip__arrow-wrapper': {
        transform: 'translate(0%, -100%) !important'
      }
    },
  '[data-popper-placement="bottom"]': {
    '.chakra-tooltip__arrow-wrapper': {
      left: '50% !important',
      transform: 'translate(-50%, -100%) !important'
    }
  },
  '[data-popper-placement^="top"]': {
    '.chakra-tooltip__arrow': {
      transform:
        'rotate(90deg) var(--my-tooltip-arrow-top-transform) !important',
      width: 'var(--my-tooltip-arrow-height) !important',
      height: 'var(--my-tooltip-arrow-width) !important'
    },
    '.chakra-tooltip__arrow-wrapper': {
      bottom: '0 !important',
      width: 'var(--my-tooltip-arrow-width) !important',
      height: 'var(--my-tooltip-arrow-height) !important'
    }
  },
  '[data-popper-placement="top-start"], [data-popper-placement="top-end"]': {
    '.chakra-tooltip__arrow-wrapper': {
      transform: 'translate(0%, 100%) !important'
    }
  },
  '[data-popper-placement="top"]': {
    '.chakra-tooltip__arrow-wrapper': {
      left: '50% !important',
      transform: 'translate(-50%, 100%) !important'
    }
  },
  '[data-popper-placement="right"], [data-popper-placement="left"]': {
    '.chakra-tooltip__arrow': {
      width: 'var(--my-tooltip-arrow-height) !important',
      height: 'var(--my-tooltip-arrow-width) !important'
    },
    '.chakra-tooltip__arrow-wrapper': {
      width: 'var(--my-tooltip-arrow-height) !important',
      height: 'var(--my-tooltip-arrow-width) !important',
      top: '50% !important',
      transform: 'translate(-100%, -50%) !important'
    }
  },
  '[data-popper-placement="right"]': {
    '.chakra-tooltip__arrow': {
      transform: 'rotate(180deg) translate(0%, 0%) !important'
    },
    '.chakra-tooltip__arrow-wrapper': {
      left: '0px !important',
      right: 'unset !important',
      transform: 'translate(-100%, -50%) !important'
    }
  },
  '[data-popper-placement="left"]': {
    '.chakra-tooltip__arrow': {
      transform: 'rotate(0deg) translate(0, 0%) !important'
    },
    '.chakra-tooltip__arrow-wrapper': {
      right: '0px !important',
      left: 'unset !important',
      transform: 'translate(100%, -50%) !important'
    }
  },
  '[data-popper-placement="top-start"], [data-popper-placement="bottom-start"]':
    {
      '.chakra-tooltip__arrow-wrapper': {
        right: 'unset !important',
        left: 'var(--my-tooltip-arrow-horizontal-space) !important'
      }
    },
  '[data-popper-placement="top-end"], [data-popper-placement="bottom-end"]': {
    '.chakra-tooltip__arrow-wrapper': {
      right: 'var(--my-tooltip-arrow-horizontal-space) !important',
      left: 'unset !important'
    }
  }
}
