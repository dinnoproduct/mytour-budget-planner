import React, { useMemo } from 'react'
import { Button, MenuButton as ChakraMenuButton, MenuItem as ChakraMenuItem } from '@chakra-ui/react'
import { Icon } from '@ui'
import { Language, LANGUAGES } from '../model'
import { LanguageButtonProps, LanguageItemProps, LanguageSelectProps } from './types'
import { Menu, MenuList } from './Menu'

export const LanguageMenu = ({ activeLanguage, onChange }: LanguageSelectProps) => {
	const currentLanguage = useMemo(() =>
			LANGUAGES.find(({ name }) => name === activeLanguage),
		[activeLanguage]
	) as Language

	return (
		<Menu offset={[0, 4]}>
			<LanguageButton language={currentLanguage}/>

			<MenuList menuButtonSize={48}>
				{LANGUAGES
					.filter(({ name }) => name !== activeLanguage)
					.map((language) => (
						<LanguageItem
							key={language.name}
							language={language}
							onClick={() => onChange(language.name)}/>
					))}
			</MenuList>
		</Menu>
	)
}

const LanguageItem = ({
	                      language,
	                      ...props
                      }: LanguageItemProps) => {
	return (
		<ChakraMenuItem
			bgColor="white"
			height="40px"
			px="4"
			_hover={{
				bgColor: 'gray.50'
			}}
			_active={{
				bgColor: 'gray.100'
			}}
			_focus={{
				bgColor: 'gray.100'
			}}
			_focusVisible={{
				bgColor: 'gray.100'
			}}
			fontSize="text-md"
			lineHeight="text-md"
			{...props}
		>
			<Icon name={language.icon} size="24" mr="4"/>

			{language.label}
		</ChakraMenuItem>
	)
}

const LanguageButton = ({ language, ...props }: LanguageButtonProps) => {
	return (
		<ChakraMenuButton
			as={Button}
			bgColor="white"
			rounded="md"
			height="48px"
			px="3"
			sx={{
				'span': {
					display: 'inline-block',
					height: '24px'
				}
			}}
			_hover={{
				bgColor: 'gray.50'
			}}
			_active={{
				bgColor: 'gray.100'
			}}
			_focus={{
				bgColor: 'gray.100'
			}}
			_focusVisible={{
				bgColor: 'gray.100'
			}}
			{...props}
		>
			<Icon name={language.icon} size="24"/>
		</ChakraMenuButton>
	)
}
