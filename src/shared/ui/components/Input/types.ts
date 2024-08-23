import { ReactNode, MouseEvent } from 'react'
import { IconName } from '@foundation/Iconography'
import { FormControlProps, FormState } from '@components/Form'
import { InputProps as ChakraInputProps } from '@chakra-ui/react'

export type InputProps = {
	value: string | number
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
} & ChakraInputProps

export type InputElementProps = {
	iconName?: IconName
	content?: ReactNode
	onClick?: (event: MouseEvent<HTMLDivElement>) => void
	isDisabled?: boolean
}
