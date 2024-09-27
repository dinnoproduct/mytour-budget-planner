import { AlertProps as ChakraAlertProps, FlexProps } from '@chakra-ui/react'
import { ReactNode } from 'react'

export type AlertProps = {
	title: string,
	description?: string
} & ChakraAlertProps

export type CardAlertMessageProps = {
	show?: boolean
	children: ReactNode
	status: CardAlertMessageStatus
} & FlexProps

export type CardAlertMessageStatus = 'warning' | 'error'