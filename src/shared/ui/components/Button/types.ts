import { type MouseEvent, type ReactNode } from 'react'
import {
  type ButtonProps as ChakraButtonProps,
  type LinkProps as ChakraLinkProps
} from '@chakra-ui/react'
import { type IconName } from '@foundation/Iconography'

export type ButtonProps = {
  children?: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  href?: string
  to?: string
  isDisabled?: boolean
  iconBefore?: IconName
  iconAfter?: IconName
  icon?: IconName
  isFillIconColor?: boolean
  isLoading?: boolean
  onMouseDown?: (event: MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onMouseUp?: (event: MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onMouseLeave?: (event: MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onMouseEnter?: (event: MouseEvent<HTMLButtonElement, MouseEvent>) => void
} & ChakraButtonProps &
  ChakraLinkProps

export type ButtonVariant =
  | 'solid-blue'
  | 'solid-gray'
  | 'solid-red'
  | 'outline-blue'
  | 'outline-red'
  | 'outline-gray'
  | 'text-blue'

export type ButtonSize = 'lg' | 'md' | 'sm' | 'xs' | 'xl'

export type LinkProps = {
  as: any
  href: string
}
