import React, { forwardRef, Ref, ReactNode } from 'react'
import { Tooltip as ChakraTooltip } from '@chakra-ui/react'

export type TooltipProps = {
  children?: ReactNode
  label: string
  size?: 'sm' | 'md' | 'lg'
  placement?:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'right'
    | 'left'

  [key: string]: any
}

export const Tooltip = forwardRef(
  (
    { children, label, size = 'sm', placement = 'top', ...props }: TooltipProps,
    ref: Ref<any>
  ) => (
    <ChakraTooltip
      ref={ref}
      label={label}
      size={size}
      placement={placement}
      hasArrow={true}
      {...props}
    >
      {children}
    </ChakraTooltip>
  )
)

Tooltip.displayName = 'Tooltip'

export { tooltipComponentTheme, tooltipStylesTheme } from './theme'
