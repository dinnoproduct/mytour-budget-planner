import { CheckboxProps } from './types'
import { Checkbox as ChakraCheckbox } from '@chakra-ui/react'
import React, { forwardRef } from 'react'

export const Checkbox = forwardRef((
	{ ...props }: CheckboxProps,
	ref
) => {
	return (
		<ChakraCheckbox ref={ref} {...props} />
	)
})

Checkbox.displayName = 'Checkbox'

export { checkboxComponentTheme } from './theme'



