import { FormState } from './types'

export const HELPER_TEXT_COLOR_MAP: {
	[key in FormState]: string
} = {
	default: 'gray.500',
	invalid: 'red.500',
	validated: 'green.500',
	warning: 'orange.500',
	disabled: 'gray.400'
}
