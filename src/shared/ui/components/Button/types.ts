import { MouseEvent, ReactNode } from 'react'
import {ButtonProps as ChakraButtonProps} from '@chakra-ui/react'
import { IconName } from '@foundation/Iconography'

export type ButtonProps = {
  children?: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  href?: string,
  to?: string
  isDisabled?: boolean
  iconBefore?: IconName
  iconAfter?: IconName
  icon?: IconName
  isLoading?: boolean
  onMouseDown?: (event: MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onMouseUp?: (event: MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onMouseLeave?: (event: MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onMouseEnter?: (event: MouseEvent<HTMLButtonElement, MouseEvent>) => void
} & ChakraButtonProps

export type ButtonVariant =
  'solid-blue'
| 'solid-gray'
| 'solid-red'
| 'outline-blue'
| 'outline-red'
| 'text-blue'

export type ButtonSize = 'lg' | 'md' | 'sm' | 'xs'

export type LinkProps = {
  as: any
  href: string
}
