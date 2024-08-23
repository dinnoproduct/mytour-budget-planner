import React, { forwardRef, Ref } from 'react'
import IcomoonReact from 'react-icomoon'
import { Box } from '@chakra-ui/react'
import { themeColor } from '@foundation/Colors'
import iconSet from './selection.json'
import {
	IconProps
} from './types'
import { isFillIcon } from './utils'

export const Icon = forwardRef(
	(
		{
			name,
			color = 'black',
			size = '24',
			...props
		}: IconProps,
		ref: Ref<any>
	) => {
		return (
			<Box
				as={IcomoonReact}
				ref={ref}
				iconSet={iconSet}
				size={size}
				icon={name}
				color={themeColor(color)}
				data-fill={isFillIcon(name)}
				{...props}
			/>
		)
	}
)

Icon.displayName = 'Icon'

export type { IconName, IconSize } from './types'
