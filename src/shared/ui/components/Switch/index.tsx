import { SwitchProps } from './types'
import { Switch as ChakraSwitch } from '@chakra-ui/react'
import React, { forwardRef } from 'react'

export const Switch = forwardRef((
	{ ...props }: SwitchProps,
	ref
) => {
	return (
		<ChakraSwitch
			ref={ref}
			{...props}
		/>
	)
})

Switch.displayName = 'Switch'


