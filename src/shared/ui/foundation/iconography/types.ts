import { BoxProps } from '@chakra-ui/react'

export type IconName =
	'language'
	| 'menu'
	| 'react'
	| 'status-error'
	| 'status-info'
	| 'status-success'
	| 'status-warning'

export type IconSize = '16' | '18' | '20' | '24' | '32' | '40'
export const ICON_SIZES: IconSize[] = ['16', '18', '20', '24', '32', '40']

export type IconProps = {
	name: IconName
	size?: IconSize
	color?: string
} & BoxProps