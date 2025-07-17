import { type ReactNode, type MouseEvent } from 'react'
import { type IconName } from '@foundation/Iconography'
import { type FormControlProps, type FormState } from '@components/Form'
import {
  type InputProps as ChakraInputProps,
  type InputElementProps as ChakraInputElementProps
} from '@chakra-ui/react'

export type InputProps = {
  value?: string | number
  placeholder?: string
  label?: string
  helperText?: string
  state?: FormState
  containerProps?: Omit<FormControlProps, 'state' | 'children'>
  rightIconName?: IconName
  leftIconName?: IconName
  onRightIconClick?: (event: MouseEvent<HTMLDivElement>) => void
  onLeftIconClick?: (event: MouseEvent<HTMLDivElement>) => void
  suffix?: ReactNode
  prefix?: ReactNode
  rightIconProps?: ChakraInputElementProps
  leftIconProps?: ChakraInputElementProps
} & ChakraInputProps

export type InputElementProps = {
  iconName?: IconName
  content?: ReactNode
  onClick?: (event: MouseEvent<HTMLDivElement>) => void
  isDisabled?: boolean
}
