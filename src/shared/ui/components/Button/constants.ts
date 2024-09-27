import { ButtonSize } from './types'
import { IconSize } from '@foundation/Iconography'

export const sizeIconSizeMap = {
	lg: '24',
	md: '20',
	sm: '16'
}

export const ICON_SIZE_MAP: {
	[key in ButtonSize]: IconSize
} = {
	'lg': '16',
	'md': '16',
	'sm': '14',
	'xs': '12'
}

export const ICON_BUTTON_SIZE_MAP: {
	[key in ButtonSize]: IconSize
} = {
	'lg': '24',
	'md': '20',
	'sm': '16',
	'xs': '12'
}
