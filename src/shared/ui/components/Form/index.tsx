import React, { forwardRef, Ref } from 'react'
import {
	FormControl as ChakraFormControl,
	FormLabel as ChakraFormLabel,
	FormHelperText as ChakraFormHelperText,
} from '@chakra-ui/react'
import {
	FormLabelProps,
	FormHelperTextProps,
	FormControlProps,
	FormControlType
} from './types'
import { HELPER_TEXT_COLOR_MAP } from './constants'

const FormControl: FormControlType = forwardRef(
	(
		{
			children,
			label,
			state,
			helperText,
			...props
		}: FormControlProps,
		ref: Ref<any>
	) => {
		return (
			<ChakraFormControl
				ref={ref}
				isDisabled={state === 'disabled'}
				isInvalid={state === 'invalid'}
				width="full"
				maxWidth="full"
				{...props}
			>
				{label ? <FormLabel>{label}</FormLabel> : null}

				{children}

				{helperText ? (
					<FormHelperText
						formState={state}
					>
						{helperText}
					</FormHelperText>
				) : null}
			</ChakraFormControl>
		)
	}
)

FormControl.displayName = 'FormControl'


const FormHelperText = ({ formState = 'default', ...props }: FormHelperTextProps) => {
	return (
		<ChakraFormHelperText
			color={HELPER_TEXT_COLOR_MAP[formState]}
			mt="2"
			fontSize="text-sm"
			lineHeight="text-sm"
			fontWeight="normal"
			align="start"
			px="0"
			mx="0"
			{...props}
		/>
	)
}

const FormLabel = (props: FormLabelProps) => {
	return (
		<ChakraFormLabel
			px="0"
			mx="0"
			{...props}
		/>
	)
}

export { FormControl, FormLabel, FormHelperText }

export type * from './types'
export { formComponentsTheme } from './theme'
