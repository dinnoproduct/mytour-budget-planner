import {
	MenuList as ChakraMenuList,
	Menu as ChakraMenu,
	MenuProps,
	VStack } from '@chakra-ui/react'
import React from 'react'
import { MenuListProps } from './types.ts'

export const Menu =(props: MenuProps) => {
	return (
		<ChakraMenu
			matchWidth
			flip={false}
			placement="bottom-start"
			{...props}
		/>
	)
}

export const MenuList = ({menuButtonSize=0, ...props}: MenuListProps) => {
	return (
		<ChakraMenuList
			as={VStack}
			bgColor="white"
			width="fit-content"
			minWidth="max-content"
			py="4"
			boxShadow="md"
			spacing="1"
			transform={`translateX(calc(-100% + ${menuButtonSize}px))`}
			{...props}
		/>
	)
}