import {
  type AlertProps as ChakraAlertProps,
  type FlexProps
} from '@chakra-ui/react'

export type AlertProps = {
  title: string
  description?: string
} & ChakraAlertProps

export type CardAlertMessageProps = {
  show?: boolean
  message: string
  status: CardAlertMessageStatus
  iconPlacement?: 'center' | 'start'
  textSize?: 'xs' | 'sm' | 'md'
} & FlexProps

export type CardAlertMessageStatus = 'warning' | 'error' | 'info'
