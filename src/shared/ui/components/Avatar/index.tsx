import { AvatarProps } from './types'
import { Avatar as ChakraAvatar, AvatarBadge } from '@chakra-ui/react'
import React from 'react'

export const Avatar = ({ showBadge = false, ...props }: AvatarProps) => {
	return (
		<ChakraAvatar
			{...props}
			bgColor={props.name ? 'blue.300' : 'gray.300'}
		>
			{showBadge ? <AvatarBadge/> : null}
		</ChakraAvatar>
	)
}

export { avatarComponentTheme } from './theme'


