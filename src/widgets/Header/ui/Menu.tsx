import {
	MenuList as ChakraMenuList,
	Menu as ChakraMenu,
	MenuProps,
	VStack,
	type StackProps,
} from '@chakra-ui/react'
import React, { forwardRef } from 'react'
import { MenuListProps } from './types'

// Framer Motion injects `initial`, `onUpdate`, `onAnimationComplete` onto the
// element Chakra's MenuList uses as its container. Those props are meaningless
// on VStack and cause DOM attribute warnings, so we strip them here.
const SafeVStack = forwardRef<HTMLDivElement, StackProps & Record<string, unknown>>(
	({ initial: _i, onUpdate: _ou, onAnimationComplete: _oac, ...props }, ref) => (
		<VStack ref={ref} {...props} />
	)
)
SafeVStack.displayName = 'SafeVStack'

export const Menu = (props: MenuProps) => {
	return (
		<ChakraMenu
			matchWidth
			flip={false}
			placement="bottom-end"
			{...props}
		/>
	)
}

export const MenuList = ({ menuButtonSize = 0, ...props }: MenuListProps) => {
	return (
		<ChakraMenuList
			as={SafeVStack}
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
