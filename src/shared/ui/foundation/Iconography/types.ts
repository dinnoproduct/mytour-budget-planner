import { BoxProps } from '@chakra-ui/react'

export type IconName =
	'language'
	| 'menu'
	| 'react'
	| 'status-error'
	| 'status-info'
	| 'status-success'
	| 'status-warning'
	| 'flag-arm'
	| 'flag-eng'
	| 'flag-rus'
	| 'facebook'
	| 'instagram'
	| 'linkedin'
	| 'star'
	| 'add'
	| 'alarm'
	| 'calendar-today'
	| 'check'
	| 'chevron-left'
	| 'chevron-right'
	| 'close'
	| 'compare-arrows'
	| 'favorite'
	| 'free-cancellation'
	| 'info-outline'
	| 'keyboard-arrow-down'
	| 'keyboard-arrow-up'
	| 'airplane-ticket'
	| 'location-pin'
	| 'logout'
	| 'people-alt'
	| 'volunteer-activism'
	| 'mail'
	| 'mobile-friendly'
	| 'phone-in-talk'
	| 'remove'
  | 'edit-note'

export type IconSize = '12' | '14' | '16' | '18' | '20' | '24' | '30' | '32' | '40'
export const ICON_SIZES: IconSize[] = ['12', '14', '16', '18', '20', '24', '30', '32', '40']

export type IconProps = {
	name: IconName | string
	size?: IconSize
	color?: string
} & BoxProps