import { FormState } from '@components/Form'

export const INPUT_COLOR_MAP: {
	[key in FormState]: {[key: string]: string}
} = {
	default: {
		borderColor: 'gray.400',
		bgColor: 'white',
	},
	invalid: {
		borderColor: 'red.400',
		bgColor: 'red.50',
	},
	validated: {
		borderColor: 'green.400',
		bgColor: 'green.50',
	},
	warning: {
		borderColor: 'orange.400',
		bgColor: 'orange.50',
	},
	disabled: {
		borderColor: 'gray.300',
		bgColor: 'white',
	},
}
