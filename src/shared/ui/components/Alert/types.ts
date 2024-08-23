import { AlertProps as ChakraAlertProps } from '@chakra-ui/react'

export type AlertProps = {
	title: string,
	description?: string
} & ChakraAlertProps