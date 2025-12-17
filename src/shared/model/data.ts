import { type Currency } from '@/entities/package'
import { type Language } from '../../widgets/Header/model'

export const LANGUAGE_PREFIX: {
  [key in Language['name']]: string
} = {
  hy: 'Arm',
  ru: 'Rus',
  en: 'Eng'
}

export const LANGUAGE_NAME_MAP: {
  [key in Language['name']]: string
} = {
  hy: 'am',
  ru: 'ru',
  en: 'en'
}

export const CURRENCY_MAP: {
  [key in Currency]: string
} = {
  USD: '$',
  EUR: '€',
  AMD: '֏',
  RUB: '₽'
}

export const MONTHS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december'
] as const
