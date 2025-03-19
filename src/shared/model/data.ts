import { Currency } from '@/entities/package'
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

export const CURRENCY_MAP: {
	[key in Currency]: string
} = {
	'USD': '$',
	'EUR': '€',
	'AMD': '֏',
	'RUB': '₽'
}