import { Language } from '../../widgets/Header/model'

export const LANGUAGE_PREFIX: {
	[key in Language['name']]: string
} = {
	'arm': 'Arm',
	'rus': 'Rus',
	'eng': 'Eng'
}

export const LANGUAGE_NAME_MAP: {
	[key in Language['name']]: string
} = {
	'arm': 'am',
	'rus': 'ru',
	'eng': 'en'
}