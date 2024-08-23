import { TooltipProps } from './types'
import { Tooltip as ChakraTooltip } from '@chakra-ui/react'
import React, { forwardRef } from 'react'

export const Tooltip = forwardRef((
	{ ...props }: TooltipProps,
	ref
) => {
	return (
		<ChakraTooltip
			ref={ref}
			hasArrow
			bgColor='gray.900'
			{...props}
		/>
	)
})

Tooltip.displayName = 'Tooltip'


