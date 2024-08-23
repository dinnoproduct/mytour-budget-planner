import { AlertProps } from './types'
import { Alert as ChakraAlert, AlertDescription, AlertIcon, AlertTitle, Flex } from '@chakra-ui/react'
import React from 'react'

export const Alert = ({ title, description, ...props }: AlertProps) => {
	return (
		<ChakraAlert
			{...props}
			{...STATUS_THEME[props?.status as Status]}
		>
			<AlertIcon />

			<Flex direction="column" align="start">
				<AlertTitle>{title}</AlertTitle>

				{description?.trim() ? (
					<AlertDescription>{description}</AlertDescription>
				) : null}
			</Flex>

		</ChakraAlert>
	)
}

export { alertComponentTheme } from './theme'

type Status = 'success' | 'error' | 'warning' | 'info'

const STATUS_THEME = {
	success: {
		borderColor: 'green.500',
	},
	error: {
		borderColor: 'red.500',
	},
	warning: {
		borderColor: 'orange.500',
	},
	info: {
		borderColor: 'blue.500',
	},
}

