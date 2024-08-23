import { ReactNode } from 'react'
import { BoxProps, MenuButtonProps, MenuItemProps, MenuListProps as ChakraMenuListProps } from '@chakra-ui/react'
import { Language } from '../model'
import { LanguageName } from '../../../shared/model'

export type LayoutProps = {
	children: ReactNode | ReactNode[]
} & BoxProps

export type LanguageSelectProps = {
	activeLanguage: string
	onChange: (lang: LanguageName) => void
}

export type LanguageButtonProps = {
	language: Language
} & MenuButtonProps

export type LanguageItemProps = {
	language: Language
} & MenuItemProps

export type MenuListProps = {
	menuButtonSize?: number
} & ChakraMenuListProps

