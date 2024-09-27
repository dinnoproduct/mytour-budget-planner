import { LanguageName } from '@shared/model'
import { IconName } from '@foundation/Iconography'

export const PACKAGE_CITIES = [
	// { value: 'hurghada', isDisabled: true },
	{ value: 'sharmElSheikh', id: 1 }
]

export const PACKAGE_LANGUAGE_MAP: {
	[key in LanguageName]: number
} = {
	'arm': 1,
	'eng': 2,
	'rus': 3
}

//
export const PACKAGE_FACILITY_ICON_MAP: {
	[key: number]: IconName
} = {
	1: 'bed',
	2: 'pool',
	4: 'snowmobile',
	8: 'nights-stay',
	16: 'cruelty-free',
	32: 'storefront',
	64: 'yard',
	128: 'bathtub',
	256: 'smoke-free',
	512: 'water',
	1024: 'twilight',
	2048: 'beach-access',
	4096: 'family-restroom',
	8192: 'kids-room',
	16384: 'sports-tennis',
};