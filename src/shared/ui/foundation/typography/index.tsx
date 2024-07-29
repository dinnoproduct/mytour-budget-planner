import React, { forwardRef, Ref } from 'react'
import { Text as ChakraText, Heading as ChakraHeading } from '@chakra-ui/react'
import { TextProps, HeadingProps } from './types'

export const Text = forwardRef(
	(
		{
			children,
			size = 'md',
			as = 'p',
			color = 'dark',
			...props
		}: TextProps,
		ref: Ref<HTMLElement>
	) => (
		<ChakraText
			ref={ref as any}
			as={as}
			variant={`text-${size}`}
			color={color === 'dark' ? 'black' : 'white'}
			{...props}
		>
			{children}
		</ChakraText>
	)
)
Text.displayName = 'Text'

export const Heading = forwardRef(
	(
		{ children, fontWeight, size = 'md', as = 'h2', color = 'dark', ...props }: HeadingProps,
		ref: Ref<any>
	) => (
		<ChakraHeading
			ref={ref}
			as={as}
			variant={`heading-${size}`}
			color={color === 'dark' ? 'black' : 'white'}
			{...props}
		>
			{children}
		</ChakraHeading>
	)
)
Heading.displayName = 'Heading'

export { typographyTheme, typographyComponentTheme } from './theme'
