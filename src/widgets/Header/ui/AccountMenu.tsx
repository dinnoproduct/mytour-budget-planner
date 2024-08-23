import React, { useMemo } from 'react'
import {
	Button,
	MenuButton as ChakraMenuButton,
	MenuItem as ChakraMenuItem
} from '@chakra-ui/react'
import { Avatar, Icon } from '@ui'
import { Menu, MenuList } from './Menu'
import { useTranslation } from 'react-i18next'

export const AccountMenu = ({}) => {
	const { t } = useTranslation()

	return (
		<Menu offset={[0, 4]}>
			<MenuButton/>

			<MenuList menuButtonSize={86}>
				<MenuItem>{t`sign-in`}</MenuItem>
				<MenuItem>{t`sign-up`}</MenuItem>
			</MenuList>
		</Menu>
	)
}

const MenuItem = ({
	                  children,
	                  ...props
                  }: any) => {
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
			{children}
		</ChakraMenuItem>
	)
}

const MenuButton = ({ isGuest = true, ...props }: any) => {
	return (
		<ChakraMenuButton
			as={Button}
			bgColor="white"
			rounded="md"
			height="48px"
			px="2"
			border="1px solid"
			borderColor="gray.200"
			sx={{
				'span': {
					display: 'flex',
					alignItems: 'center'
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
			<Icon name="menu" size="24" color="gray.500"/>

			<Avatar size="sm" ml="3"/>
		</ChakraMenuButton>
	)
}
