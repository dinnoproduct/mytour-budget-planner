export const MENU_LIST_MOBILE_ROOT_PROPS = {
  position: { base: 'fixed !important' as any, md: undefined },
  top: { base: '80px !important', md: undefined },
  left: { base: '0 !important', md: undefined },
  right: { base: '0 !important', md: undefined },
  bottom: { base: '0 !important', md: undefined },
  height: {
    base: 'calc(100dvh - 80px) !important',
    md: undefined
  },
  zIndex: { base: '100000 !important', md: undefined },
  overflowY: { base: 'hidden !important' as any, md: undefined },
  width: { base: '100dvw !important', md: undefined },
  transform: {
    base: 'translate3d(0px, 0px, 0px) !important',
    md: undefined
  }
}

export const MENU_BUTTON_WIDTH = {
  base: 'full',
  md: '350px',
  lg: '320px'
} as const

